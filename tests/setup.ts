import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null,
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

if (!globalThis.crypto?.randomUUID) {
    Object.defineProperty(globalThis, 'crypto', {
        value: {
            randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
        },
    });
}

// Mock Supabase
vi.mock('../services/supabaseClient', () => {
    return {
        isSupabaseConfigured: () => true, // Force online mode for tests
        supabase: {
            auth: {
                getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
                onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
                signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user', email: 'test@test.com' } }, error: null }),
                signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user', email: 'test@test.com' } }, error: null }),
                signOut: vi.fn().mockResolvedValue({ error: null }),
                updateUser: vi.fn().mockResolvedValue({ error: null })
            },
            from: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }), // Simulate row not found
                update: vi.fn().mockReturnThis(),
                upsert: vi.fn().mockResolvedValue({ error: null })
            })
        }
    };
});
