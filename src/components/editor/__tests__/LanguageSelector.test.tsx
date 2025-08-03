import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LanguageSelector from '../LanguageSelector';
import editorReducer from '@/store/slices/editorSlice';
import { Language } from '@/types';

// Mock store setup
const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            editor: editorReducer,
        },
        preloadedState: {
            editor: {
                code: '',
                language: 'python' as Language,
                breakpoints: [],
                currentLine: undefined,
                ...initialState,
            },
        },
    });
};

describe('LanguageSelector', () => {
    it('renders with correct initial language', () => {
        const store = createMockStore();

        render(
            <Provider store={store}>
                <LanguageSelector />
            </Provider>
        );

        const select = screen.getByLabelText('Language');
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue('python');
    });

    it('displays all supported languages', () => {
        const store = createMockStore();

        render(
            <Provider store={store}>
                <LanguageSelector />
            </Provider>
        );

        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('C++')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
    });

    it('changes language when option is selected', () => {
        const store = createMockStore();

        render(
            <Provider store={store}>
                <LanguageSelector />
            </Provider>
        );

        const select = screen.getByLabelText('Language');
        fireEvent.change(select, { target: { value: 'java' } });

        // Check if the store state was updated
        const state = store.getState();
        expect(state.editor.language).toBe('java');
    });

    it('reflects current language from store', () => {
        const store = createMockStore({ language: 'cpp' as Language });

        render(
            <Provider store={store}>
                <LanguageSelector />
            </Provider>
        );

        const select = screen.getByLabelText('Language');
        expect(select).toHaveValue('cpp');
    });
});