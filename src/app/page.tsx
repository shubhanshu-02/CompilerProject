'use client';

import { EditorPanel } from '@/components/editor';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Code Visualization Editor
          </h1>
          <p className="text-gray-600">
            Write code and visualize its execution in real-time
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <EditorPanel height="600px" />
          </div>
          
          {/* Placeholder for visualization panels */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Memory Visualization</h3>
            <p className="text-gray-500">Memory visualization will appear here</p>
          </div>
          
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Variable State</h3>
            <p className="text-gray-500">Variable state will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
