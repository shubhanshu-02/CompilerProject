import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisualizationState, VisualizationType, ExecutionStep } from '@/types';

const initialState: VisualizationState = {
  activeVisualizations: ['memory', 'variables'],
  animationSpeed: 1,
  isRecording: false,
  history: [],
  currentStep: 0,
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    toggleVisualization: (state, action: PayloadAction<VisualizationType>) => {
      const type = action.payload;
      const index = state.activeVisualizations.indexOf(type);
      if (index > -1) {
        state.activeVisualizations.splice(index, 1);
      } else {
        state.activeVisualizations.push(type);
      }
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.animationSpeed = action.payload;
    },
    startRecording: (state) => {
      state.isRecording = true;
      state.history = [];
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    addExecutionStep: (state, action: PayloadAction<ExecutionStep>) => {
      if (state.isRecording) {
        state.history.push(action.payload);
        state.currentStep = state.history.length - 1;
      }
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = Math.max(0, Math.min(action.payload, state.history.length - 1));
    },
  },
});

export const {
  toggleVisualization,
  setAnimationSpeed,
  startRecording,
  stopRecording,
  addExecutionStep,
  setCurrentStep,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
