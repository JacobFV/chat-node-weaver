import React from 'react';
import NodeEditor from '../components/NodeEditor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">LLM Chat Node Editor</h1>
      <NodeEditor />
    </div>
  );
};

export default Index;