import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [];
const initialEdges = [];

function FlowchartEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [delayType, setDelayType] = useState('Instant');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // Load the saved flowchart data from localStorage on mount
  useEffect(() => {
    const savedFlowchart = localStorage.getItem('flowchart');
    if (savedFlowchart) {
      const { nodes, edges } = JSON.parse(savedFlowchart);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const addNode = (type) => {
    setNodes((nds) => [
      ...nds,
      {
        id: `${type}-${nds.length}`,
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `${type} Node` },
      },
    ]);
    if (type === 'Cold Email') {
      setShowEmailForm(true);  // Show email form when Cold Email node is added
    }
  };

  const saveFlowchart = () => {
    const flowchartData = { nodes, edges };
    localStorage.setItem('flowchart', JSON.stringify(flowchartData));
  };

  const resetFlowchart = () => {
    localStorage.removeItem('flowchart');
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const handleDelayChange = (delay) => {
    setDelayType(delay);
  };

  const handleAddColdEmail = async () => {
    // Log email sending logic based on delay type here
    console.log('Sending cold email to:', recipientEmail);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('Delay Type:', delayType);

    // Determine the endpoint based on delay type
    let endpoint;
    if (delayType === 'Instant') {
      endpoint = 'http://localhost:5000/schedule-email';
    } else if (delayType === 'minute') {
      endpoint = 'http://localhost:5000/schedule-email/min';
    } else if (delayType === 'hour') {
      endpoint = 'http://localhost:5000/schedule-email/hour';
    } else {
      console.error('Invalid delay type');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: recipientEmail,
          subject: subject,
          body: body,
        }),
      });

      if (response.ok) {
        console.log('Email scheduled successfully');
        const responseText = await response.text();
        console.log('Response:', responseText);
        setResponseMessage(responseText); // Set the response message

      } else {
        console.error('Failed to schedule email');
        setResponseMessage('Failed to schedule email'); // Set the error message
      }
    } catch (error) {
      console.error('Error scheduling email:', error);
      setResponseMessage('Error scheduling email'); // Set the error message
    }

    setShowEmailForm(false);
  };

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 space-x-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => addNode('Cold Email')}
        >
          Add Cold Email Node
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => addNode('Wait/Delay')}
        >
          Add Wait/Delay Node
        </button>

        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={saveFlowchart}
        >
          Save Flowchart
        </button>

        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={resetFlowchart}
        >
          Reset Flowchart
        </button>
      </div>

      {showEmailForm && (
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md w-full max-w-lg">
          {/* Recipient Email Input */}
          <input
            type="email"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Email Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>

          <div className="mb-4">
            <p>Choose Delay Type:</p>
            <button
              className={`bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 ${delayType === 'Instant' ? 'bg-green-500' : ''}`}
              onClick={() => handleDelayChange('Instant')}
            >
              Instant
            </button>
            <button
              className={`bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 ${delayType === 'minute' ? 'bg-yellow-500' : ''}`}
              onClick={() => handleDelayChange('minute')}
            >
              60 seconds
            </button>
            <button
              className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${delayType === 'hour' ? 'bg-red-500' : ''}`}
              onClick={() => handleDelayChange('hour')}
            >
              60 minutes
            </button>
          </div>

          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={handleAddColdEmail}
          >
            Add Cold Email
          </button>
        </div>
      )}

      <div className="w-full h-[60vh] bg-white shadow-md rounded-lg border border-gray-300">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        {responseMessage && (
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlowchartEditor;

