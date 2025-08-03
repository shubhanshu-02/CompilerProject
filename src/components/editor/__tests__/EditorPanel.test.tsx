import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EditorPanel from '../EditorPanel';
import editorReducer from '@/store/slices/editorSlice';
import { Language } from '@/types';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, language }: { value: string; language: string }) => (
    <div data-testid="monaco-editor">
      <div>Language: {language}</div>
      <div>Code: {value}</div>
    </div>
  ),
}));

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

// Mock window.alert
Object.defineProperty(window, 'alert', {
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

describe('EditorPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all editor components', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <EditorPanel />
      </Provider>
    );

    // Check for header
    expect(screen.getByText('Code Editor')).toBeInTheDocument();

    // Check for language selector
    expect(screen.getByLabelText('Language')).toBeInTheDocument();

    // Check for toolbar buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
    expect(screen.getByText('Save File')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();

    // Check for Monaco editor
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <EditorPanel className="custom-class" />
      </Provider>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays current code and language in editor', () => {
    const store = createMockStore({
      code: 'console.log("test");',
      language: 'java' as Language,
    });

    render(
      <Provider store={store}>
        <EditorPanel />
      </Provider>
    );

    expect(screen.getByText('Language: java')).toBeInTheDocument();
    expect(screen.getByText('Code: console.log("test");')).toBeInTheDocument();
  });

  it('shows syntax validator when there are errors', async () => {
    const store = createMockStore({
      code: 'if True\n    print("missing colon")',
      language: 'python' as Language,
    });

    render(
      <Provider store={store}>
        <EditorPanel />
      </Provider>
    );

    // The syntax validator should be present (it will show validation message)
    expect(screen.getByText('Validating syntax...')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <EditorPanel height="600px" />
      </Provider>
    );

    // The Monaco editor mock doesn't use height prop, but we can verify the component renders
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('has proper structure and styling classes', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <EditorPanel />
      </Provider>
    );

    const editorPanel = container.firstChild as HTMLElement;
    expect(editorPanel).toHaveClass('editor-panel', 'border', 'rounded-lg', 'overflow-hidden');

    // Check for header structure
    const header = container.querySelector('.editor-header');
    expect(header).toHaveClass('bg-gray-50', 'p-3', 'border-b');

    // Check for toolbar
    const toolbar = container.querySelector('.editor-toolbar');
    expect(toolbar).toHaveClass('flex', 'flex-wrap', 'gap-2', 'p-2', 'bg-gray-100', 'border-b');
  });
});