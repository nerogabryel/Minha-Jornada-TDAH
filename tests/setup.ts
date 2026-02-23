import '@testing-library/jest-dom/vitest';

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

// Mock crypto.randomUUID
if (!globalThis.crypto?.randomUUID) {
    Object.defineProperty(globalThis, 'crypto', {
        value: {
            randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
        },
    });
}
