import React, { useRef, useEffect } from 'react';
import type { NodeType } from '../types/workflow';

interface Props {
  onAdd: (type: NodeType) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

export const AddNodePopover: React.FC<Props> = ({ onAdd, onClose, position }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const getAdjustedPosition = () => {
    const popoverWidth = 260;
    const popoverHeight = 250;
    const padding = 20;

    let adjustedX = position.x;
    let adjustedY = position.y + 10;

    if (adjustedX + popoverWidth / 2 > window.innerWidth - padding) {
      adjustedX = window.innerWidth - popoverWidth / 2 - padding;
    }

    if (adjustedX - popoverWidth / 2 < padding) {
      adjustedX = popoverWidth / 2 + padding;
    }

    if (adjustedY + popoverHeight > window.innerHeight - padding) {
      adjustedY = position.y - popoverHeight - 10;
    }

    if (adjustedY < padding) {
      adjustedY = padding;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const adjustedPosition = getAdjustedPosition();

  const handleAdd = (type: NodeType) => {
    onAdd(type);
    onClose();
  };

  return (
    <div 
      ref={popoverRef}
      className="add-node-popover"
      style={{
        position: 'fixed',
        top: adjustedPosition.y,
        left: adjustedPosition.x,
        transform: 'translate(-50%, 0)',
      }}
    >
      <div className="popover-header">
        <span>Add Node</span>
        <button className="popover-close" onClick={onClose}>×</button>
      </div>
      <div className="popover-options">
        <button 
          className="popover-option action" 
          onClick={() => handleAdd('action')}
          title="Add an action step"
        >
          <span className="option-icon">⚡</span>
          <div className="option-content">
            <strong>Action</strong>
            <small>Sequential step</small>
          </div>
        </button>
        <button 
          className="popover-option branch" 
          onClick={() => handleAdd('branch')}
          title="Add a conditional branch"
        >
          <span className="option-icon">🔀</span>
          <div className="option-content">
            <strong>Branch</strong>
            <small>Conditional path</small>
          </div>
        </button>
        <button 
          className="popover-option end" 
          onClick={() => handleAdd('end')}
          title="Add an end point"
        >
          <span className="option-icon">🏁</span>
          <div className="option-content">
            <strong>End</strong>
            <small>Terminal node</small>
          </div>
        </button>
      </div>
    </div>
  );
};
