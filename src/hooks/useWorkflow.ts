// src/hooks/useWorkflow.ts
import { useState } from 'react';
import type { Node, WorkflowNodes, NodeType } from '../types/workflow';

const initialNodes: WorkflowNodes = {
  'start': { id: 'start', type: 'start', label: 'Start', children: [] },
};

export const useWorkflow = () => {
  const [nodes, setNodes] = useState<WorkflowNodes>(initialNodes);
  const [history, setHistory] = useState<WorkflowNodes[]>([initialNodes]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToHistory = (newNodes: WorkflowNodes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setNodes(newNodes);
  };

  const addNode = (parentId: string, type: NodeType) => {
    const newId = generateId();
    const newNode: Node = {
      id: newId,
      type,
      label: type === 'action' ? 'New Action' : type === 'branch' ? 'New Condition' : 'End',
      children: []
    };

    const parent = nodes[parentId];
    const newNodes = {
      ...nodes,
      [newId]: newNode,
      [parentId]: {
        ...parent,
        children: [...parent.children, newId]
      }
    };
    
    addToHistory(newNodes);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'start') return;

    const newNodes = { ...nodes };
    const nodeToDelete = newNodes[nodeId];
    
    const parentId = Object.keys(newNodes).find(key => 
      newNodes[key].children.includes(nodeId)
    );

    if (parentId) {
      const parent = newNodes[parentId];
      
      const newChildren = parent.children.filter(id => id !== nodeId);
      
      if (nodeToDelete.children.length > 0) {
        newChildren.push(...nodeToDelete.children);
      }

      newNodes[parentId] = { ...parent, children: newChildren };
    }

    delete newNodes[nodeId];
    addToHistory(newNodes);
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], label: newLabel }
    }));
  };

  const exportWorkflow = () => {
    const dataStr = JSON.stringify(nodes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `workflow_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importWorkflow = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setNodes(imported);
      } catch (error) {
        alert('Invalid workflow file');
      }
    };
    reader.readAsText(file);
  };

  const resetWorkflow = () => {
    if (confirm('Are you sure you want to reset the workflow? This cannot be undone.')) {
      setNodes(initialNodes);
      setHistory([initialNodes]);
      setHistoryIndex(0);
    }
  };

  const saveWorkflow = () => {
    console.log('=== WORKFLOW DATA ===');
    console.log(JSON.stringify(nodes, null, 2));
    console.log('=== END WORKFLOW DATA ===');
    alert('Workflow saved to console! Check browser developer tools.');
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex]);
    }
  };

  return { 
    nodes, 
    addNode, 
    deleteNode, 
    updateNodeLabel, 
    exportWorkflow, 
    importWorkflow, 
    resetWorkflow,
    saveWorkflow,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};