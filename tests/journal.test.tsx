import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { JournalProvider, useJournal } from '../context/JournalContext';

const JournalTestConsumer: React.FC = () => {
    const { entries, addEntry, deleteEntry, getStreak } = useJournal();

    return (
        <div>
            <div data-testid="count">{entries.length}</div>
            <div data-testid="streak">{getStreak()}</div>
            <div data-testid="entries">{JSON.stringify(entries)}</div>
            <button data-testid="add-awesome" onClick={() => addEntry({ mood: 'awesome', tags: ['Foco'], content: 'Great day!' })}>Add Awesome</button>
            <button data-testid="add-bad" onClick={() => addEntry({ mood: 'bad', tags: [], content: 'Tough day' })}>Add Bad</button>
            <button data-testid="delete-first" onClick={() => { if (entries.length > 0) deleteEntry(entries[0].id); }}>Delete First</button>
        </div>
    );
};

const renderWithProviders = () => {
    return render(
        <AuthProvider>
            <JournalProvider>
                <JournalTestConsumer />
            </JournalProvider>
        </AuthProvider>
    );
};

describe('JournalContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('starts with no entries', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('0');
        });
    });

    it('adds a journal entry', async () => {
        renderWithProviders();

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-awesome'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('1');
            const entries = JSON.parse(screen.getByTestId('entries').textContent || '[]');
            expect(entries[0].mood).toBe('awesome');
            expect(entries[0].tags).toEqual(['Foco']);
            expect(entries[0].content).toBe('Great day!');
        });
    });

    it('adds entries in reverse chronological order', async () => {
        renderWithProviders();

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-awesome'));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-bad'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('2');
            const entries = JSON.parse(screen.getByTestId('entries').textContent || '[]');
            // Most recent first
            expect(entries[0].mood).toBe('bad');
            expect(entries[1].mood).toBe('awesome');
        });
    });

    it('deletes an entry', async () => {
        renderWithProviders();

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-awesome'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('1');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('delete-first'));
        });

        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('0');
        });
    });

    it('persists entries to localStorage', async () => {
        renderWithProviders();

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-awesome'));
        });

        await waitFor(() => {
            const saved = localStorage.getItem('tdah_app_journal');
            expect(saved).not.toBeNull();
            const entries = JSON.parse(saved!);
            expect(entries.length).toBe(1);
            expect(entries[0].mood).toBe('awesome');
        });
    });

    it('calculates streak for today', async () => {
        renderWithProviders();

        await act(async () => {
            fireEvent.click(screen.getByTestId('add-awesome'));
        });

        await waitFor(() => {
            // Entry was added today, so streak should be 1
            expect(screen.getByTestId('streak').textContent).toBe('1');
        });
    });

    it('streak is 0 with no entries', () => {
        renderWithProviders();
        expect(screen.getByTestId('streak').textContent).toBe('0');
    });
});
