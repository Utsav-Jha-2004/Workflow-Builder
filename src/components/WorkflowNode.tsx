import React, { useState, useRef } from 'react';
import type {WorkflowNodes, NodeType } from '../types/workflow';
import { AddNodePopover } from './AddNodePopover';

interface Props {
  id: string;
  nodes: WorkflowNodes;
  onAdd: (parentId: string, type: NodeType) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, label: string) => void;
}

export const WorkflowNode: React.FC<Props> = ({ id, nodes, onAdd, onDelete, onEdit }) => {
  const node = nodes[id];
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const addButtonRef = useRef<HTMLButtonElement>(null);
  
  if (!node) return null;

  const handleAddClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom
    });
    setShowPopover(true);
  };

  const handleAddNode = (type: NodeType) => {
    onAdd(id, type);
  };

  return (
    <div className="node-wrapper">
      <div className={`node-card ${node.type}`}>
        <div className="node-header">
          <small>{node.type.toUpperCase()}</small>
          {node.type !== 'start' && (
            <button className="delete-btn" onClick={() => onDelete(id)} title="Delete node">×</button>
          )}
        </div>
        
        <input 
          value={node.label} 
          onChange={(e) => onEdit(id, e.target.value)} 
          className="node-input"
          placeholder="Enter label..."
        />

        {node.type !== 'end' && (
          <button 
            ref={addButtonRef}
            className="add-node-trigger" 
            onClick={handleAddClick}
            title="Add child node"
          >
            ➕ Add Node
          </button>
        )}
      </div>

      {showPopover && (
        <AddNodePopover
          onAdd={handleAddNode}
          onClose={() => setShowPopover(false)}
          position={popoverPosition}
        />
      )}

      {node.children.length > 0 && <div className="line-vertical" />}

      <div className={`children-container ${node.children.length > 1 ? 'branch-layout' : ''}`}>
        {node.children.map((childId) => (
          <div key={childId} className="child-wrapper">
             <WorkflowNode 
               id={childId} 
               nodes={nodes} 
               onAdd={onAdd} 
               onDelete={onDelete} 
               onEdit={onEdit} 
             />
          </div>
        ))}
      </div>
    </div>
  );
};