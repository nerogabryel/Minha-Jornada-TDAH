import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  subscriptionTier?: string;
  bigFiveTrait?: string;
}

export type NavItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

export type ActivityType = 'text_reflection' | 'quiz' | 'checklist' | 'daily_log' | 'timeline' | 'action_plan';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  motivational_text?: string;
  isCompleted: boolean;
  content?: any;
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  activities: Activity[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  locked: boolean;
  lessons: Lesson[];
}

// Journal Types
export type MoodType = 'awesome' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  mood: MoodType;
  tags: string[];
  content: string;
}