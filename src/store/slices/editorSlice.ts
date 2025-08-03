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
    },
    toggleBreakpoint: (state, action: PayloadAction<number>) => {
      const line = action.payload;
      const index = state.breakpoints.indexOf(line);
      if (index > -1) {
        state.breakpoints.splice(index, 1);
      } else {
        state.breakpoints.push(line);
      }
    },
    setCurrentLine: (state, action: PayloadAction<number | undefined>) => {
      state.currentLine = action.payload;
    },
  },
});

export const { setCode, setLanguage, toggleBreakpoint, setCurrentLine } = editorSlice.actions;
export default editorSlice.reducer;
