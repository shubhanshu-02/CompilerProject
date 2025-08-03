'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux';

interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

const SyntaxValidator: React.FC = () => {
  const { code, language } = useAppSelector(state => state.editor);
  const [errors, setErrors] = useState<SyntaxError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Basic syntax validation for different languages
  const validateSyntax = (code: string, language: string): SyntaxError[] => {
    const errors: SyntaxError[] = [];
    const lines = code.split('\n');

    switch (language) {
      case 'python':
        return validatePython(lines);
      case 'c':
      case 'cpp':
        return validateC(lines);
      case 'java':
        return validateJava(lines);
      default:
        return [];
    }
  };

  const validatePython = (lines: string[]): SyntaxError[] => {
    const errors: SyntaxError[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) return;

      // Check for basic syntax errors
      if (trimmed.endsWith(':')) {
        // Check if it's a valid control structure
        const controlStructures = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with'];
        const startsWithControl = controlStructures.some(keyword => 
          trimmed.startsWith(keyword + ' ') || trimmed === keyword + ':'
        );
        
        if (!startsWithControl && !trimmed.includes('lambda')) {
          errors.push({
            line: lineNum,
            column: line.indexOf(':') + 1,
            message: 'Unexpected colon',
            severity: 'error'
          });
        }
      }

      // Check for unmatched parentheses, brackets, braces
      const openChars = ['(', '[', '{'];
      const closeChars = [')', ']', '}'];
      const stack: string[] = [];
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (openChars.includes(char)) {
          stack.push(char);
        } else if (closeChars.includes(char)) {
          const expected = openChars[closeChars.indexOf(char)];
          if (stack.length === 0 || stack.pop() !== expected) {
            errors.push({
              line: lineNum,
              column: i + 1,
              message: `Unmatched '${char}'`,
              severity: 'error'
            });
          }
        }
      }

      // Check for unclosed brackets at end of line
      if (stack.length > 0) {
        errors.push({
          line: lineNum,
          column: line.length,
          message: `Unclosed '${stack[stack.length - 1]}'`,
          severity: 'error'
        });
      }
    });

    return errors;
  };

  const validateC = (lines: string[]): SyntaxError[] => {
    const errors: SyntaxError[] = [];
    let braceCount = 0;
    let hasMain = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      // Check for main function
      if (trimmed.includes('main(')) {
        hasMain = true;
      }

      // Count braces
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      // Check for missing semicolons (basic check)
      if (trimmed.length > 0 && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('#') &&
          !trimmed.includes('//')) {
        
        // Skip control structures and function declarations
        const controlKeywords = ['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default'];
        const isControlStructure = controlKeywords.some(keyword => 
          trimmed.startsWith(keyword + ' ') || trimmed.startsWith(keyword + '(')
        );
        
        if (!isControlStructure && !trimmed.includes('(') && trimmed.length > 1) {
          errors.push({
            line: lineNum,
            column: line.length,
            message: 'Missing semicolon',
            severity: 'warning'
          });
        }
      }
    });

    // Check for unmatched braces
    if (braceCount !== 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: braceCount > 0 ? 'Unclosed brace' : 'Extra closing brace',
        severity: 'error'
      });
    }

    // Check for missing main function (warning)
    if (!hasMain && lines.some(line => line.trim().length > 0)) {
      errors.push({
        line: 1,
        column: 1,
        message: 'No main function found',
        severity: 'warning'
      });
    }

    return errors;
  };

  const validateJava = (lines: string[]): SyntaxError[] => {
    const errors: SyntaxError[] = [];
    let braceCount = 0;
    let hasClass = false;
    let hasMain = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      // Check for class declaration
      if (trimmed.includes('class ')) {
        hasClass = true;
      }

      // Check for main method
      if (trimmed.includes('public static void main')) {
        hasMain = true;
      }

      // Count braces
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      // Check for missing semicolons
      if (trimmed.length > 0 && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('package') &&
          !trimmed.startsWith('import') &&
          !trimmed.includes('//')) {
        
        const controlKeywords = ['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'try', 'catch', 'finally'];
        const isControlStructure = controlKeywords.some(keyword => 
          trimmed.startsWith(keyword + ' ') || trimmed.startsWith(keyword + '(')
        );
        
        if (!isControlStructure && !trimmed.includes('(') && trimmed.length > 1) {
          errors.push({
            line: lineNum,
            column: line.length,
            message: 'Missing semicolon',
            severity: 'warning'
          });
        }
      }
    });

    // Check for missing class
    if (!hasClass && lines.some(line => line.trim().length > 0)) {
      errors.push({
        line: 1,
        column: 1,
        message: 'No class declaration found',
        severity: 'warning'
      });
    }

    return errors;
  };

  // Validate syntax when code or language changes
  useEffect(() => {
    if (!code.trim()) {
      setErrors([]);
      return;
    }

    setIsValidating(true);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      const syntaxErrors = validateSyntax(code, language);
      setErrors(syntaxErrors);
      setIsValidating(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [code, language]);

  if (!errors.length && !isValidating) {
    return null;
  }

  return (
    <div className="syntax-validator bg-gray-50 border-t">
      {isValidating && (
        <div className="p-2 text-sm text-gray-600">
          Validating syntax...
        </div>
      )}
      
      {errors.length > 0 && (
        <div className="p-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Syntax Issues ({errors.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className={`text-xs p-1 rounded ${
                  error.severity === 'error' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                <span className="font-medium">
                  Line {error.line}, Column {error.column}:
                </span>{' '}
                {error.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyntaxValidator;