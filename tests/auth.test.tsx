import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Test component that exposes auth state
const AuthTestConsumer: React.FC = () => {
    const { user, login, signup, logout, isLoading, isOnlineMode } = useAuth();
    return (
        <div>
            <div data-testid="loading">{String(isLoading)}</div>
            <div data-testid="online">{String(isOnlineMode)}</div>
            <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
            <button data-testid="login" onClick={() => login('test@test.com', '123456')}>Login</button>
            <button data-testid="signup" onClick={() => signup('test@test.com', '123456', 'Test')}>Signup</button>
            <button data-testid="logout" onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('starts with no user and not loading', async () => {
        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });
        expect(screen.getByTestId('user').textContent).toBe('null');
    });

    it('runs in offline mode when Supabase is not configured', async () => {
        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('online').textContent).toBe('false');
        });
    });

    it('logs in with mock user in offline mode', async () => {
        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('login'));
        });

        await waitFor(() => {
            const userData = screen.getByTestId('user').textContent;
            expect(userData).not.toBe('null');
            const parsed = JSON.parse(userData!);
            expect(parsed.email).toBe('test@test.com');
        });
    });

    it('persists user to localStorage on login', async () => {
        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('login'));
        });

        await waitFor(() => {
            const stored = localStorage.getItem('tdah_app_user');
            expect(stored).not.toBeNull();
            expect(JSON.parse(stored!).email).toBe('test@test.com');
        });
    });

    it('clears user on logout', async () => {
        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading').textContent).toBe('false');
        });

        // Login first
        await act(async () => {
            fireEvent.click(screen.getByTestId('login'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('user').textContent).not.toBe('null');
        });

        // Then logout
        await act(async () => {
            fireEvent.click(screen.getByTestId('logout'));
        });

        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(localStorage.getItem('tdah_app_user')).toBeNull();
    });

    it('restores user from localStorage on mount', async () => {
        const mockUser = { id: 'u1', name: 'Ana', email: 'ana@test.com' };
        localStorage.setItem('tdah_app_user', JSON.stringify(mockUser));

        render(
            <AuthProvider>
                <AuthTestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            const userData = screen.getByTestId('user').textContent;
            expect(userData).not.toBe('null');
            expect(JSON.parse(userData!).email).toBe('ana@test.com');
        });
    });
});
