'use client';

import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setCode } from '@/store/slices/editorSlice';

interface EditorToolbarProps {
  className?: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const { code, language } = useAppSelector(state => state.editor);

  // Save code to localStorage
  const handleSave = useCallback(() => {
    try {
      const savedCode = {
        code,
        language,
        timestamp: Date.now(),
      };
      localStorage.setItem(`code-editor-${language}`, JSON.stringify(savedCode));
      
      // Show success feedback (you could replace this with a toast notification)
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Failed to save code:', error);
      alert('Failed to save code. Please try again.');
    }
  }, [code, language]);

  // Load code from localStorage
  const handleLoad = useCallback(() => {
    try {
      const savedData = localStorage.getItem(`code-editor-${language}`);
      if (savedData) {
        const { code: savedCode } = JSON.parse(savedData);
        dispatch(setCode(savedCode));
        alert('Code loaded successfully!');
      } else {
        alert('No saved code found for this language.');
      }
    } catch (error) {
      console.error('Failed to load code:', error);
      alert('Failed to load code. Please try again.');
    }
  }, [dispatch, language]);

  // Load code from file
  const handleLoadFromFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.c,.cpp,.java,.txt';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          dispatch(setCode(content));
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }, [dispatch]);

  // Save code to file
  const handleSaveToFile = useCallback(() => {
    const getFileExtension = (lang: string) => {
      switch (lang) {
        case 'python': return '.py';
        case 'c': return '.c';
        case 'cpp': return '.cpp';
        case 'java': return '.java';
        default: return '.txt';
      }
    };

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, language]);

  // Clear code
  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all code?')) {
      dispatch(setCode(''));
    }
  }, [dispatch]);

  return (
    <div className={`editor-toolbar flex flex-wrap gap-2 p-2 bg-gray-100 border-b ${className}`}>
      <button
        onClick={handleSave}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        title="Save to browser storage"
      >
        Save
      </button>
      
      <button
        onClick={handleLoad}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        title="Load from browser storage"
      >
        Load
      </button>
      
      <button
        onClick={handleLoadFromFile}
        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        title="Load from file"
      >
        Open File
      </button>
      
      <button
        onClick={handleSaveToFile}
        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
        title="Save to file"
      >
        Save File
      </button>
      
      <button
        onClick={handleClear}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        title="Clear all code"
      >
        Clear
      </button>
    </div>
  );
};

export default EditorToolbar;