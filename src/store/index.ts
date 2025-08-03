import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './slices/editorSlice';
import executionReducer from './slices/executionSlice';
import visualizationReducer from './slices/visualizationSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    execution: executionReducer,
    visualization: visualizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
