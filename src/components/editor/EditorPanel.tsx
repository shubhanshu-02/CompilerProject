'use client';

import React from 'react';
import CodeEditor from './CodeEditor';
import LanguageSelector from './LanguageSelector';
import EditorToolbar from './EditorToolbar';
import SyntaxValidator from './SyntaxValidator';

interface EditorPanelProps {
  className?: string;
  height?: string;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  className = '', 
  height = '500px' 
}) => {
  return (
    <div className={`editor-panel border rounded-lg overflow-hidden ${className}`}>
      {/* Header with language selector */}
      <div className="editor-header bg-gray-50 p-3 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>
        <LanguageSelector />
      </div>

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main editor */}
      <div className="editor-content">
        <CodeEditor height={height} />
      </div>

      {/* Syntax validation */}
      <SyntaxValidator />
    </div>
  );
};

export default EditorPanel;