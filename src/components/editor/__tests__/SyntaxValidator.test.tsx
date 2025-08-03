import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SyntaxValidator from '../SyntaxValidator';
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

describe('SyntaxValidator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when code is empty', () => {
    const store = createMockStore({ code: '' });
    
    const { container } = render(
      <Provider store={store}>
        <SyntaxValidator />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows validation message when validating', async () => {
    const store = createMockStore({ 
      code: 'print("hello")',
      language: 'python' as Language 
    });
    
    render(
      <Provider store={store}>
        <SyntaxValidator />
      </Provider>
    );

    expect(screen.getByText('Validating syntax...')).toBeInTheDocument();
  });

  it('validates syntax for different languages', () => {
    const languages: Language[] = ['python', 'c', 'cpp', 'java'];
    
    languages.forEach(lang => {
      const store = createMockStore({ 
        code: 'test code',
        language: lang 
      });
      
      const { unmount } = render(
        <Provider store={store}>
          <SyntaxValidator />
        </Provider>
      );

      // Just verify the component renders without crashing
      expect(screen.getByText('Validating syntax...')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles empty code gracefully', () => {
    const store = createMockStore({ code: '' });
    
    const { container } = render(
      <Provider store={store}>
        <SyntaxValidator />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows validation in progress', () => {
    const store = createMockStore({ 
      code: 'print("hello")',
      language: 'python' as Language 
    });
    
    render(
      <Provider store={store}>
        <SyntaxValidator />
      </Provider>
    );

    expect(screen.getByText('Validating syntax...')).toBeInTheDocument();
  });

  it('renders syntax validator component', () => {
    const store = createMockStore({ 
      code: 'test',
      language: 'python' as Language 
    });
    
    const { container } = render(
      <Provider store={store}>
        <SyntaxValidator />
      </Provider>
    );

    expect(container.querySelector('.syntax-validator')).toBeInTheDocument();
  });
});