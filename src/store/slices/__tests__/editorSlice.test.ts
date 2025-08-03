import { describe, it, expect } from 'vitest';
import editorReducer, {
  setCode,
  setLanguage,
  toggleBreakpoint,
  setCurrentLine,
  clearBreakpoints,
  loadCodeFromStorage,
} from '../editorSlice';
import { Language } from '@/types';

describe('editorSlice', () => {
  const initialState = {
    code: '',
    language: 'python' as Language,
    breakpoints: [],
    currentLine: undefined,
  };

  it('should return the initial state', () => {
    expect(editorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCode', () => {
    const newCode = 'print("Hello, World!")';
    const actual = editorReducer(initialState, setCode(newCode));
    expect(actual.code).toEqual(newCode);
  });

  it('should handle setLanguage', () => {
    const stateWithBreakpoints = {
      ...initialState,
      breakpoints: [1, 2, 3],
      currentLine: 2,
    };
    
    const actual = editorReducer(stateWithBreakpoints, setLanguage('java'));
    expect(actual.language).toEqual('java');
    expect(actual.breakpoints).toEqual([]);
    expect(actual.currentLine).toBeUndefined();
  });

  it('should handle toggleBreakpoint - add breakpoint', () => {
    const actual = editorReducer(initialState, toggleBreakpoint(5));
    expect(actual.breakpoints).toEqual([5]);
  });

  it('should handle toggleBreakpoint - remove breakpoint', () => {
    const stateWithBreakpoint = {
      ...initialState,
      breakpoints: [5],
    };
    
    const actual = editorReducer(stateWithBreakpoint, toggleBreakpoint(5));
    expect(actual.breakpoints).toEqual([]);
  });

  it('should handle toggleBreakpoint - maintain sorted order', () => {
    const stateWithBreakpoints = {
      ...initialState,
      breakpoints: [1, 5, 10],
    };
    
    const actual = editorReducer(stateWithBreakpoints, toggleBreakpoint(7));
    expect(actual.breakpoints).toEqual([1, 5, 7, 10]);
  });

  it('should handle setCurrentLine', () => {
    const actual = editorReducer(initialState, setCurrentLine(10));
    expect(actual.currentLine).toEqual(10);
  });

  it('should handle setCurrentLine with undefined', () => {
    const stateWithCurrentLine = {
      ...initialState,
      currentLine: 5,
    };
    
    const actual = editorReducer(stateWithCurrentLine, setCurrentLine(undefined));
    expect(actual.currentLine).toBeUndefined();
  });

  it('should handle clearBreakpoints', () => {
    const stateWithBreakpoints = {
      ...initialState,
      breakpoints: [1, 2, 3, 4, 5],
    };
    
    const actual = editorReducer(stateWithBreakpoints, clearBreakpoints());
    expect(actual.breakpoints).toEqual([]);
  });

  it('should handle loadCodeFromStorage', () => {
    const stateWithData = {
      ...initialState,
      code: 'old code',
      language: 'python' as Language,
      breakpoints: [1, 2],
      currentLine: 3,
    };
    
    const payload = {
      code: 'new code from storage',
      language: 'java' as Language,
    };
    
    const actual = editorReducer(stateWithData, loadCodeFromStorage(payload));
    expect(actual.code).toEqual('new code from storage');
    expect(actual.language).toEqual('java');
    expect(actual.breakpoints).toEqual([]);
    expect(actual.currentLine).toBeUndefined();
  });
});