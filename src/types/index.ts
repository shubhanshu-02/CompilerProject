// Core types for the code visualization editor

export type Language = 'python' | 'c' | 'cpp' | 'java';

export interface CodeEditorProps {
  language: Language;
  code: string;
  breakpoints: number[];
  onCodeChange: (code: string) => void;
  onBreakpointToggle: (line: number) => void;
  highlightLine?: (line: number) => void;
}

export interface ExecutionState {
  currentLine: number;
  callStack: StackFrame[];
  variables: VariableState;
  memory: MemoryState;
  isRunning: boolean;
  isPaused: boolean;
  executionSpeed: 'slow' | 'normal' | 'fast';
}

export interface StackFrame {
  functionName: string;
  lineNumber: number;
  localVariables: Variable[];
}

export interface Variable {
  name: string;
  value: unknown;
  type: string;
  memoryAddress?: string;
}

export interface VariableState {
  [key: string]: Variable;
}

export interface MemoryState {
  stack: StackMemory;
  heap: HeapMemory;
  staticMemory: StaticMemory;
}

export interface StackMemory {
  frames: MemoryFrame[];
  currentSize: number;
  maxSize: number;
}

export interface HeapMemory {
  allocatedBlocks: MemoryBlock[];
  freeBlocks: MemoryBlock[];
  totalSize: number;
}

export interface StaticMemory {
  variables: Variable[];
}

export interface MemoryFrame {
  id: string;
  functionName: string;
  variables: Variable[];
  size: number;
}

export interface MemoryBlock {
  address: string;
  size: number;
  type: string;
  allocated: boolean;
}

export interface VisualizationState {
  activeVisualizations: VisualizationType[];
  animationSpeed: number;
  isRecording: boolean;
  history: ExecutionStep[];
  currentStep: number;
}

export type VisualizationType = 'memory' | 'variables' | 'loops' | 'recursion' | 'graph';

export interface ExecutionStep {
  timestamp: number;
  lineNumber: number;
  memoryState: MemoryState;
  variableChanges: VariableChange[];
  visualizationData: Record<string, unknown>;
}

export interface VariableChange {
  name: string;
  oldValue: unknown;
  newValue: unknown;
  type: string;
}
