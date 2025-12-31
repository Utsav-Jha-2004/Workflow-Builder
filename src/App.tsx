import { useWorkflow } from './hooks/useWorkflow';
import { WorkflowNode } from './components/WorkflowNode';
import { useEffect } from 'react';
import './App.css';

function App() {
  const { 
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
    canUndo,
    canRedo
  } = useWorkflow();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWorkflow();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [undo, redo, saveWorkflow]);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) importWorkflow(file);
    };
    input.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Workflow-Builder</h1>
        <div className="header-controls">
          <button 
            className="control-btn icon-btn" 
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button 
            className="control-btn icon-btn" 
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
          <div className="divider"></div>
          <button className="control-btn secondary" onClick={saveWorkflow}>
            💾 Save
          </button>
          <button className="control-btn primary" onClick={exportWorkflow}>
            📥 Export
          </button>
          <button className="control-btn secondary" onClick={handleImport}>
            📤 Import
          </button>
          <button className="control-btn danger" onClick={resetWorkflow}>
            🔄 Reset
          </button>
        </div>
      </header>
      
      <div className="canvas">
        <WorkflowNode
          id="start"
          nodes={nodes}
          onAdd={addNode}
          onDelete={deleteNode}
          onEdit={updateNodeLabel}
        />
      </div>
    </div>
  );
}

export default App;