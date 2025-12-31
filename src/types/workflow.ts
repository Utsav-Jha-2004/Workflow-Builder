export type NodeType = 'start' | 'action' | 'branch' | 'end';

export interface Node {
  id: string;
  type: NodeType;
  label: string;
  children: string[]; 
}

export interface WorkflowNodes {
  [key: string]: Node;
}