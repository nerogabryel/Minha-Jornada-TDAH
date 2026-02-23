import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Module, Activity } from '../types';
import { MOCK_MODULES } from '../constants';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

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
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

          if (data && !error) {
            loadedModules = data.modules as Module[];
            loadedStreak = { count: data.streak, lastDate: data.last_active_date };
          }
        } catch (e) {
          console.warn('Failed to load from Supabase, falling back to localStorage', e);
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

      setModules(loadedModules || MOCK_MODULES);
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
  }, [user]);

  // Save to localStorage + Supabase whenever modules change
  const saveProgress = useCallback(async (updatedModules: Module[], updatedStreak: number, updatedLastDate: string | null) => {
    // Always save to localStorage (instant, offline-first)
    localStorage.setItem(LS_PROGRESS, JSON.stringify(updatedModules));
    localStorage.setItem(LS_STREAK, JSON.stringify({ count: updatedStreak, lastDate: updatedLastDate }));

    // Sync to Supabase (best-effort, non-blocking)
    if (isSupabaseConfigured() && supabase && user) {
      try {
        await supabase.from('user_progress').upsert({
          user_id: user.id,
          modules: updatedModules,
          streak: updatedStreak,
          last_active_date: updatedLastDate,
        }, { onConflict: 'user_id' });
      } catch (e) {
        console.warn('Failed to sync progress to Supabase', e);
      }
    }
  }, [user]);

  // Auto-save when state changes
  useEffect(() => {
    if (isLoaded) {
      saveProgress(modules, streak, lastActiveDate);
    }
  }, [modules, streak, lastActiveDate, isLoaded, saveProgress]);

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
    setModules(MOCK_MODULES);
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