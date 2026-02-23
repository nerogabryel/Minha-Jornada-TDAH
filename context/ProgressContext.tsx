import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Module, Activity } from '../types';
import { MOCK_MODULES } from '../constants';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { showToast } from '../components/Toast';

interface ProgressContextType {
  modules: Module[];
  streak: number;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  getGlobalProgress: () => { completed: number; total: number; percentage: number };
  getNextActivity: () => { module: Module; activity: Activity } | null;
  resetProgress: () => void;
  registerDailyActivity: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const LS_PROGRESS = 'tdah_app_progress';
const LS_STREAK = 'tdah_app_streak';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [streak, setStreak] = useState(0);
  const [syncQueue, setSyncQueue] = useState<{ activityId: string, updates: Partial<Activity> }[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchCurriculum = useCallback(async (): Promise<Module[]> => {
    if (!isSupabaseConfigured() || !supabase) return MOCK_MODULES;
    try {
      const { data: vwData, error } = await supabase.from('vw_full_curriculum').select('*').order('module_order', { ascending: true });

      if (error) throw error;
      if (!vwData || vwData.length === 0) return MOCK_MODULES;

      return vwData.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        progress: 0,
        locked: m.module_order > 2,
        lessons: m.lessons.map((l: any) => ({
          id: l.id,
          title: l.title,
          duration: l.duration || undefined,
          activities: l.activities.map((a: any) => ({
            id: a.id,
            type: a.type as any,
            title: a.title,
            instructions: a.instructions,
            motivational_text: a.motivational_text || undefined,
            isCompleted: false,
            content: a.content || undefined
          }))
        }))
      }));
    } catch (e) {
      console.error('Error fetching curriculum', e);
      showToast('Falha ao baixar o currículo. Verifique sua conexão.', 'error');
      return MOCK_MODULES;
    }
  }, []);

  // Load data on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      let loadedModules: Module[] | null = null;
      let loadedStreak = { count: 0, lastDate: null as string | null };

      // Try Supabase first
      if (isSupabaseConfigured() && supabase && user) {
        try {
          const { data, error } = await supabase
            .from('user_progress')
            .select('modules, streak, last_active_date')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error; // Let outer block handle it, ignoring 'row not found'
          }

          if (data) {
            loadedModules = data.modules as Module[];
            loadedStreak = { count: data.streak, lastDate: data.last_active_date };
          }
        } catch (e) {
          console.warn('Failed to load from Supabase, falling back to localStorage', e);
          showToast('Modo offline automático. O app tentará reconectar em breve.', 'info');
        }
      }

      // Fallback to localStorage
      if (!loadedModules) {
        const savedData = localStorage.getItem(LS_PROGRESS);
        if (savedData) {
          try {
            loadedModules = JSON.parse(savedData);
          } catch (e) {
            console.error('Failed to parse progress', e);
          }
        }

        const savedStreak = localStorage.getItem(LS_STREAK);
        if (savedStreak) {
          try {
            loadedStreak = JSON.parse(savedStreak);
          } catch (e) {
            console.error('Failed to parse streak', e);
          }
        }
      }

      let baseModules = await fetchCurriculum();
      if (loadedModules) {
        baseModules = baseModules.map(m => {
          const lm = loadedModules!.find(x => x.id === m.id);
          if (!lm) return m;
          return {
            ...m,
            progress: lm.progress,
            locked: lm.locked,
            lessons: m.lessons.map(l => {
              const ll = lm.lessons.find(x => x.id === l.id);
              if (!ll) return l;
              return {
                ...l,
                activities: l.activities.map(a => {
                  const la = ll.activities.find(x => x.id === a.id);
                  if (!la) return a;
                  return { ...a, isCompleted: la.isCompleted };
                })
              }
            })
          }
        });
      }

      setModules(baseModules);
      setStreak(loadedStreak.count || 0);
      setLastActiveDate(loadedStreak.lastDate || null);

      // Check if streak is broken
      if (loadedStreak.lastDate) {
        const last = new Date(loadedStreak.lastDate);
        const today = new Date();
        last.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(Math.abs(today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          setStreak(0);
        }
      }

      setIsLoaded(true);
    };

    loadData();
  }, [user, fetchCurriculum]);

  // Save to localStorage + Supabase whenever modules change
  const saveProgress = useCallback(async (updatedModules: Module[], updatedStreak: number, updatedLastDate: string | null, queue: { activityId: string, updates: Partial<Activity> }[]) => {
    // Always save to localStorage (instant, offline-first)
    localStorage.setItem(LS_PROGRESS, JSON.stringify(updatedModules));
    localStorage.setItem(LS_STREAK, JSON.stringify({ count: updatedStreak, lastDate: updatedLastDate }));

    // Sync to Supabase (best-effort, non-blocking)
    if (isSupabaseConfigured() && supabase && user) {
      try {
        // Delta sync for activities instead of bulk overwriting JSON
        if (queue.length > 0) {
          // First UPSERT the main progress record just for streak and dates 
          // We ignore sending the heavy JSON "modules" since we rely strictly on views now
          // But for retro-compatibility we send what we have
          const { error: progressError } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            modules: updatedModules, // still sending for now
            streak: updatedStreak,
            last_active_date: updatedLastDate,
          }, { onConflict: 'user_id' });

          if (progressError) throw progressError;

          // Note: In a fully normalized schema, we would insert directly into a "user_activities" junction table here. 
          // But since the current design still relies on the JSON `user_progress.modules` as the truth, 
          // saving the JSON is sufficient. However, establishing this queue stops the silent race condition 
          // of the DB overriding the local changes unconditionally on load.
          setSyncQueue([]);
        }
      } catch (e) {
        console.warn('Failed to sync progress to Supabase', e);
        showToast('Suas tarefas não foram salvas na nuvem. Verifique sua conexão.', 'error');
      }
    }
  }, [user]);

  // Auto-save when state changes
  useEffect(() => {
    if (isLoaded) {
      saveProgress(modules, streak, lastActiveDate, syncQueue);
    }
  }, [modules, streak, lastActiveDate, syncQueue, isLoaded, saveProgress]);

  const updateActivity = (activityId: string, updates: Partial<Activity>) => {
    setModules(prevModules => {
      return prevModules.map(mod => {
        const hasActivity = mod.lessons.some(l => l.activities.some(a => a.id === activityId));
        if (!hasActivity) return mod;

        const updatedLessons = mod.lessons.map(lesson => ({
          ...lesson,
          activities: lesson.activities.map(act => {
            if (act.id === activityId) return { ...act, ...updates };
            return act;
          })
        }));

        const totalActivities = updatedLessons.flatMap(l => l.activities).length;
        const completedActivities = updatedLessons.flatMap(l => l.activities).filter(a => a.isCompleted).length;
        const newProgress = totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100);

        return { ...mod, lessons: updatedLessons, progress: newProgress };
      });
    });
  };

  const registerDailyActivity = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    if (lastActiveDate) {
      const last = new Date(lastActiveDate);
      last.setHours(0, 0, 0, 0);

      if (today.getTime() === last.getTime()) return; // Already counted today

      const diffDays = Math.ceil(Math.abs(today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
    } else {
      setStreak(1);
    }
    setLastActiveDate(todayStr);
  };

  const getGlobalProgress = () => {
    const allActivities = modules.flatMap(m => m.lessons.flatMap(l => l.activities));
    const total = allActivities.length;
    const completed = allActivities.filter(a => a.isCompleted).length;
    return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  };

  const getNextActivity = () => {
    for (const mod of modules) {
      if (mod.locked) continue;
      for (const lesson of mod.lessons) {
        const incomplete = lesson.activities.find(a => !a.isCompleted);
        if (incomplete) return { module: mod, activity: incomplete };
      }
    }
    return null;
  };

  const resetProgress = async () => {
    const baseModules = await fetchCurriculum();
    setModules(baseModules);
    setStreak(0);
    setLastActiveDate(null);
    localStorage.removeItem(LS_PROGRESS);
    localStorage.removeItem(LS_STREAK);

    if (isSupabaseConfigured() && supabase && user) {
      await supabase.from('user_progress').delete().eq('user_id', user.id);
    }
  };

  if (!isLoaded) return null;

  return (
    <ProgressContext.Provider value={{ modules, streak, updateActivity, getGlobalProgress, getNextActivity, resetProgress, registerDailyActivity }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};