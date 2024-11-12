import React, { useState } from 'react';
import ReactFlow, { addEdge, useNodesState, useEdgesState, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Start Email Sequence' },
  },
  {
    id: '2',
    position: { x: 250, y: 150 },
    data: { label: 'Cold Email' },
  },
  {
    id: '3',
    position: { x: 250, y: 300 },
    data: { label: 'Wait/Delay' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('email'); // 'email' or 'delay'

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: nodeName || `New ${nodeType === 'email' ? 'Email' : 'Delay'}` },
      type: nodeType === 'email' ? 'emailNode' : 'delayNode',
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName(''); // Reset node name after adding
  };

  const saveFlow = async () => {
    try {
      await axios.post('http://localhost:5000/api/save-flow', { nodes, edges });
      alert('✅ Flow saved successfully');
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('❌ Failed to save flow');
    }
  };

  const scheduleEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/schedule-email', {
        to: 'kuwarx1@gmail.com',
        subject: 'Test Email',
        body: 'This is a test email',
        delay: 'in 1 hour',
      });
      alert('✅ Email scheduled successfully');
    } catch (error) {
      console.error('Error scheduling email:', error);
      alert('❌ Failed to schedule email');
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-100 to-white p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Email Marketing Flow Designer</h1>
      <div className="w-full h-[70%] rounded-lg shadow-lg border bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <div className="flex gap-4 mt-6">
        <input
          className="px-4 py-2 rounded-md border"
          placeholder="Node name"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-md border"
          value={nodeType}
          onChange={(e) => setNodeType(e.target.value)}
        >
          <option value="email">Cold Email</option>
          <option value="delay">Wait/Delay</option>
        </select>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          onClick={addNode}
        >
          ➕ Add Node
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          onClick={saveFlow}
        >
          💾 Save Flow
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          onClick={scheduleEmail}
        >
          ✉️ Schedule Email
        </button>
      </div>
    </div>
  );
};

export default FlowChart;
