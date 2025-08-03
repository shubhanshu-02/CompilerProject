'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setLanguage } from '@/store/slices/editorSlice';
import { Language } from '@/types';

const LanguageSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(state => state.editor);

  const languages: { value: Language; label: string }[] = [
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
  ];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(event.target.value as Language));
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
        Language
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {languages.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;