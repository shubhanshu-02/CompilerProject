'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setCode, toggleBreakpoint } from '@/store/slices/editorSlice';
import { Language } from '@/types';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  className?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  className = '', 
  height = '400px' 
}) => {
  const dispatch = useAppDispatch();
  const { code, language, breakpoints, currentLine } = useAppSelector(state => state.editor);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Handle editor mount
  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
    });

    // Add breakpoint click handler
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const lineNumber = e.target.position?.lineNumber;
        if (lineNumber) {
          dispatch(toggleBreakpoint(lineNumber));
        }
      }
    });
  }, [dispatch]);

  // Handle code changes
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      dispatch(setCode(value));
    }
  }, [dispatch]);

  // Update breakpoint decorations when breakpoints change
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const decorations = breakpoints.map(line => ({
        range: new monacoRef.current!.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'breakpoint-decoration',
          glyphMarginClassName: 'breakpoint-glyph',
          glyphMarginHoverMessage: { value: 'Breakpoint' },
        }
      }));

      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [breakpoints]);

  // Update current line highlighting
  useEffect(() => {
    if (editorRef.current && monacoRef.current && currentLine !== undefined) {
      const decorations = [{
        range: new monacoRef.current.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-decoration',
          glyphMarginClassName: 'current-line-glyph',
        }
      }];

      editorRef.current.createDecorationsCollection(decorations);
    }
  }, [currentLine]);

  // Get Monaco language identifier
  const getMonacoLanguage = (lang: Language): string => {
    switch (lang) {
      case 'python':
        return 'python';
      case 'c':
        return 'c';
      case 'cpp':
        return 'cpp';
      case 'java':
        return 'java';
      default:
        return 'python';
    }
  };

  return (
    <div className={`code-editor-container ${className}`}>
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleCodeChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          wordWrap: 'on',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .code-editor-container .breakpoint-decoration {
            background-color: rgba(255, 0, 0, 0.2);
          }
          .code-editor-container .breakpoint-glyph {
            background-color: #ff0000;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            margin-left: 2px;
            margin-top: 2px;
          }
          .code-editor-container .current-line-decoration {
            background-color: rgba(255, 255, 0, 0.2);
          }
          .code-editor-container .current-line-glyph {
            background-color: #ffff00;
            width: 4px;
            margin-left: 6px;
          }
        `
      }} />
    </div>
  );
};

export default CodeEditor;