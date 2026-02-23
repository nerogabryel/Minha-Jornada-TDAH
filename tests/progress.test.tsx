import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ProgressProvider, useProgress } from '../context/ProgressContext';

// Must wrap with AuthProvider since ProgressProvider depends on it
const ProgressTestConsumer: React.FC = () => {
    const { modules, streak, getGlobalProgress, getNextActivity, updateActivity, resetProgress, registerDailyActivity } = useProgress();
    const progress = getGlobalProgress();
    const next = getNextActivity();

    return (
        <div>
            <div data-testid="module-count">{modules.length}</div>
            <div data-testid="streak">{streak}</div>
            <div data-testid="progress">{progress.percentage}</div>
            <div data-testid="completed">{progress.completed}</div>
            <div data-testid="total">{progress.total}</div>
            <div data-testid="next">{next ? next.activity.id : 'none'}</div>
            <button data-testid="complete-next" onClick={() => {
                if (next) updateActivity(next.activity.id, { isCompleted: true });
            }}>Complete</button>
            <button data-testid="register-daily" onClick={() => registerDailyActivity()}>Register</button>
            <button data-testid="reset" onClick={() => resetProgress()}>Reset</button>
        </div>
    );
};

const renderWithProviders = () => {
    return render(
        <AuthProvider>
            <ProgressProvider>
                <ProgressTestConsumer />
            </ProgressProvider>
        </AuthProvider>
    );
};

describe('ProgressContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('loads mock modules when no saved data exists', async () => {
        renderWithProviders();

        await waitFor(() => {
            const moduleCount = parseInt(screen.getByTestId('module-count').textContent || '0');
            expect(moduleCount).toBeGreaterThan(0);
        });
    });

    it('starts with 0% progress', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByTestId('progress').textContent).toBe('0');
        });
    });

    it('has activities to complete', async () => {
        renderWithProviders();

        await waitFor(() => {
            const total = parseInt(screen.getByTestId('total').textContent || '0');
            expect(total).toBeGreaterThan(0);
        });
    });

    it('finds next activity when progress is 0', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByTestId('next').textContent).not.toBe('none');
        });
    });

    it('updates progress when completing an activity', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByTestId('next').textContent).not.toBe('none');
        });

        const completedBefore = parseInt(screen.getByTestId('completed').textContent || '0');

        await act(async () => {
            fireEvent.click(screen.getByTestId('complete-next'));
        });

        await waitFor(() => {
            const completedAfter = parseInt(screen.getByTestId('completed').textContent || '0');
            expect(completedAfter).toBe(completedBefore + 1);
        });
    });

    it('resets progress correctly', async () => {
        renderWithProviders();

        // Complete an activity first
        await waitFor(() => {
            expect(screen.getByTestId('next').textContent).not.toBe('none');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('complete-next'));
        });

        await waitFor(() => {
            const completed = parseInt(screen.getByTestId('completed').textContent || '0');
            expect(completed).toBeGreaterThan(0);
        });

        // Reset
        await act(async () => {
            fireEvent.click(screen.getByTestId('reset'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('completed').textContent).toBe('0');
            expect(screen.getByTestId('streak').textContent).toBe('0');
        });
    });

    it('persists progress to localStorage', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByTestId('next').textContent).not.toBe('none');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('complete-next'));
        });

        await waitFor(() => {
            const saved = localStorage.getItem('tdah_app_progress');
            expect(saved).not.toBeNull();
            const modules = JSON.parse(saved!);
            const allActivities = modules.flatMap((m: any) => m.lessons.flatMap((l: any) => l.activities));
            const completed = allActivities.filter((a: any) => a.isCompleted);
            expect(completed.length).toBeGreaterThan(0);
        });
    });
});
