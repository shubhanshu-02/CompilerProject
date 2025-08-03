import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditorToolbar from '../EditorToolbar';
import editorReducer from '@/store/slices/editorSlice';
import { Language } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.alert and window.confirm
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});

Object.defineProperty(window, 'confirm', {
  value: vi.fn(),
});

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
});

// Mock store setup
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      editor: editorReducer,
    },
    preloadedState: {
      editor: {
        code: 'print("hello")',
        language: 'python' as Language,
        breakpoints: [],
        currentLine: undefined,
        ...initialState,
      },
    },
  });
};

describe('EditorToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all toolbar buttons', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
    expect(screen.getByText('Save File')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('saves code to localStorage when save button is clicked', () => {
    const store = createMockStore({
      code: 'test code',
      language: 'python' as Language,
    });
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Save'));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'code-editor-python',
      expect.stringContaining('test code')
    );
    expect(window.alert).toHaveBeenCalledWith('Code saved successfully!');
  });

  it('loads code from localStorage when load button is clicked', () => {
    const savedData = JSON.stringify({
      code: 'loaded code',
      language: 'python',
      timestamp: Date.now(),
    });
    
    localStorageMock.getItem.mockReturnValue(savedData);
    
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Load'));

    expect(localStorageMock.getItem).toHaveBeenCalledWith('code-editor-python');
    expect(window.alert).toHaveBeenCalledWith('Code loaded successfully!');
    
    // Check if code was updated in store
    const state = store.getState();
    expect(state.editor.code).toBe('loaded code');
  });

  it('shows alert when no saved code is found', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Load'));

    expect(window.alert).toHaveBeenCalledWith('No saved code found for this language.');
  });

  it('handles localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Save'));

    expect(window.alert).toHaveBeenCalledWith('Failed to save code. Please try again.');
  });

  it('clears code when clear button is clicked and confirmed', () => {
    (window.confirm as any).mockReturnValue(true);
    
    const store = createMockStore({ code: 'some code' });
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Clear'));

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear all code?');
    
    const state = store.getState();
    expect(state.editor.code).toBe('');
  });

  it('does not clear code when clear is not confirmed', () => {
    (window.confirm as any).mockReturnValue(false);
    
    const store = createMockStore({ code: 'some code' });
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Clear'));

    const state = store.getState();
    expect(state.editor.code).toBe('some code');
  });

  it('has save file button that triggers file download', () => {
    const store = createMockStore({
      code: 'test code',
      language: 'python' as Language,
    });
    
    render(
      <Provider store={store}>
        <EditorToolbar />
      </Provider>
    );

    const saveFileButton = screen.getByText('Save File');
    expect(saveFileButton).toBeInTheDocument();
    expect(saveFileButton).toHaveAttribute('title', 'Save to file');
  });
});