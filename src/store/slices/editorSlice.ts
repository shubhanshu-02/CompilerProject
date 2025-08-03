import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/types';

interface EditorState {
  code: string;
  language: Language;
  breakpoints: number[];
  currentLine?: number;
}

const initialState: EditorState = {
  code: '',
  language: 'python',
  breakpoints: [],
  currentLine: undefined,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Clear breakpoints when switching languages
      state.breakpoints = [];
      state.currentLine = undefined;
    },
    toggleBreakpoint: (state, action: PayloadAction<number>) => {
      const line = action.payload;
      const index = state.breakpoints.indexOf(line);
      if (index > -1) {
        state.breakpoints.splice(index, 1);
      } else {
        state.breakpoints.push(line);
        state.breakpoints.sort((a, b) => a - b);
      }
    },
    setCurrentLine: (state, action: PayloadAction<number | undefined>) => {
      state.currentLine = action.payload;
    },
    clearBreakpoints: (state) => {
      state.breakpoints = [];
    },
    loadCodeFromStorage: (state, action: PayloadAction<{ code: string; language: Language }>) => {
      state.code = action.payload.code;
      state.language = action.payload.language;
      state.breakpoints = [];
      state.currentLine = undefined;
    },
  },
});

export const { 
  setCode, 
  setLanguage, 
  toggleBreakpoint, 
  setCurrentLine, 
  clearBreakpoints, 
  loadCodeFromStorage 
} = editorSlice.actions;
export default editorSlice.reducer;
