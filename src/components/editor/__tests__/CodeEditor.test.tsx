import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CodeEditor from '../CodeEditor';
import editorReducer from '@/store/slices/editorSlice';
import { Language } from '@/types';

// Mock Monaco Editor
const mockEditor = {
  updateOptions: vi.fn(),
  onMouseDown: vi.fn(),
  deltaDecorations: vi.fn(() => []),
  getModel: vi.fn(() => ({
    onDidChangeContent: vi.fn(),
  })),
};

const mockMonaco = {
  editor: {
    MouseTargetType: {
      GUTTER_GLYPH_MARGIN: 1,
    },
  },
  Range: vi.fn().mockImplementation((startLine, startCol, endLine, endCol) => ({
    startLineNumber: startLine,
    startColumn: startCol,
    endLineNumber: endLine,
    endColumn: endCol,
  })),
};

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, language, onChange, onMount }: any) => {
    // Simulate editor mount
    if (onMount) {
      setTimeout(() => onMount(mockEditor, mockMonaco), 0);
    }
    
    return (
      <div data-testid="monaco-editor">
        <div data-testid="editor-language">{language}</div>
        <textarea
          data-testid="editor-content"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
    );
  },
}));

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

describe('CodeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Monaco editor with correct props', () => {
    const store = createMockStore({
      code: 'print("hello")',
      language: 'python' as Language,
    });
    
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByTestId('editor-language')).toHaveTextContent('python');
    expect(screen.getByTestId('editor-content')).toHaveValue('print("hello")');
  });

  it('handles code changes', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    const textarea = screen.getByTestId('editor-content');
    fireEvent.change(textarea, { target: { value: 'new code' } });

    // Check if the store was updated
    expect(store.getState().editor.code).toBe('new code');
  });

  it('applies custom className and height', () => {
    const store = createMockStore();
    
    const { container } = render(
      <Provider store={store}>
        <CodeEditor className="custom-class" height="600px" />
      </Provider>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('maps language correctly to Monaco language identifiers', () => {
    const testCases = [
      { input: 'python', expected: 'python' },
      { input: 'c', expected: 'c' },
      { input: 'cpp', expected: 'cpp' },
      { input: 'java', expected: 'java' },
    ];

    testCases.forEach(({ input, expected }) => {
      const store = createMockStore({ language: input as Language });
      
      const { unmount } = render(
        <Provider store={store}>
          <CodeEditor />
        </Provider>
      );

      expect(screen.getByTestId('editor-language')).toHaveTextContent(expected);
      unmount();
    });
  });

  it('configures editor options on mount', async () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    // Wait for onMount to be called
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockEditor.updateOptions).toHaveBeenCalledWith({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
    });
  });

  it('sets up mouse event handler for breakpoints', async () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    // Wait for onMount to be called
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockEditor.onMouseDown).toHaveBeenCalled();
  });

  it('renders with default props', () => {
    const store = createMockStore();
    
    const { container } = render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    expect(container.firstChild).toHaveClass('code-editor-container');
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
  });

  it('includes breakpoint and current line styles', () => {
    const store = createMockStore();
    
    const { container } = render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    const styleElement = container.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.innerHTML).toContain('breakpoint-decoration');
    expect(styleElement?.innerHTML).toContain('current-line-decoration');
  });
});