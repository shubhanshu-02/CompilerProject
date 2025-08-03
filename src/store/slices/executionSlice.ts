import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecutionState, VariableState, MemoryState } from '@/types';

const initialState: ExecutionState = {
  currentLine: 0,
  callStack: [],
  variables: {},
  memory: {
    stack: {
      frames: [],
      currentSize: 0,
      maxSize: 1024,
    },
    heap: {
      allocatedBlocks: [],
      freeBlocks: [],
      totalSize: 0,
    },
    staticMemory: {
      variables: [],
    },
  },
  isRunning: false,
  isPaused: false,
  executionSpeed: 'normal',
};

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    startExecution: (state) => {
      state.isRunning = true;
      state.isPaused = false;
    },
    pauseExecution: (state) => {
      state.isPaused = true;
    },
    stopExecution: (state) => {
      state.isRunning = false;
      state.isPaused = false;
      state.currentLine = 0;
    },
    setCurrentLine: (state, action: PayloadAction<number>) => {
      state.currentLine = action.payload;
    },
    updateVariables: (state, action: PayloadAction<VariableState>) => {
      state.variables = action.payload;
    },
    updateMemory: (state, action: PayloadAction<MemoryState>) => {
      state.memory = action.payload;
    },
    setExecutionSpeed: (state, action: PayloadAction<'slow' | 'normal' | 'fast'>) => {
      state.executionSpeed = action.payload;
    },
  },
});

export const {
  startExecution,
  pauseExecution,
  stopExecution,
  setCurrentLine,
  updateVariables,
  updateMemory,
  setExecutionSpeed,
} = executionSlice.actions;

export default executionSlice.reducer;
