import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  getStreak: () => number;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const LS_JOURNAL = 'tdah_app_journal';

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries on mount or when user changes
  useEffect(() => {
    const loadEntries = async () => {
      let loaded: JournalEntry[] | null = null;

      if (isSupabaseConfigured() && supabase && user) {
        try {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('id, mood, tags, content, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (data && !error) {
            loaded = data.map(row => ({
              id: row.id,
              date: row.created_at,
              mood: row.mood,
              tags: row.tags || [],
              content: row.content || '',
            }));
            // Update localStorage cache
            localStorage.setItem(LS_JOURNAL, JSON.stringify(loaded));
          }
        } catch (e) {
          console.warn('Failed to load journal from Supabase', e);
        }
      }

      // Fallback to localStorage
      if (!loaded) {
        const saved = localStorage.getItem(LS_JOURNAL);
        if (saved) {
          try {
            loaded = JSON.parse(saved);
          } catch (e) {
            console.error('Failed to parse journal', e);
          }
        }
      }

      setEntries(loaded || []);
      setIsLoaded(true);
    };

    loadEntries();
  }, [user]);

  // Save to localStorage whenever entries change (cache)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LS_JOURNAL, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const addEntry = async (entryData: Omit<JournalEntry, 'id' | 'date'>) => {
    const localId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newEntry: JournalEntry = {
      id: localId,
      date: now,
      ...entryData,
    };

    // Optimistic update
    setEntries(prev => [newEntry, ...prev]);

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase && user) {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            id: localId,
            user_id: user.id,
            mood: entryData.mood,
            tags: entryData.tags,
            content: entryData.content,
            created_at: now,
          })
          .select('id')
          .single();

        if (error) {
          console.warn('Failed to save journal entry to Supabase', error);
        }
      } catch (e) {
        console.warn('Failed to sync journal entry', e);
      }
    }
  };

  const deleteEntry = async (id: string) => {
    // Optimistic update
    setEntries(prev => prev.filter(e => e.id !== id));

    // Sync to Supabase
    if (isSupabaseConfigured() && supabase && user) {
      try {
        await supabase.from('journal_entries').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete journal entry from Supabase', e);
      }
    }
  };

  const getStreak = (): number => {
    if (entries.length === 0) return 0;

    // Calculate CONSECUTIVE days streak (fixed from original)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateTimes = entries.map(e => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    const uniqueDates = Array.from(new Set(dateTimes)).sort((a: number, b: number) => b - a);

    let consecutiveDays = 0;
    let checkDate = today.getTime();

    for (const dateTime of uniqueDates) {
      if (dateTime === checkDate) {
        consecutiveDays++;
        checkDate -= 24 * 60 * 60 * 1000; // Go back one day
      } else if (dateTime < checkDate) {
        break; // Gap found
      }
    }

    return consecutiveDays;
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, deleteEntry, getStreak }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};