export type NodeType =
  | 'client'
  | 'gateway'
  | 'cache'
  | 'database'
  | 'queue'
  | 'worker'
  | 'node';

export type NodeState =
  | 'idle'
  | 'active'
  | 'processing'
  | 'hit'
  | 'miss'
  | 'success'
  | 'warning'
  | 'error';

export type PacketType =
  | 'http_request'
  | 'http_response'
  | 'cache_lookup'
  | 'cache_hit'
  | 'cache_miss'
  | 'db_query'
  | 'db_write'
  | 'queue_publish'
  | 'queue_consume'
  | 'rate_limited';

export interface NodeMetrics {
  cpuUsage?: number;
  memoryUsage?: string;
  latencyMs?: number;
  qps?: number;
  throughputRps?: number;
  hitRate?: number;
  queueDepth?: number;
  statusText?: string;
}

export interface SystemNode {
  id: string;
  name: string;
  sublabel: string;
  type: NodeType;
  position: [number, number, number];
  state: NodeState;
  color?: string;
  metrics: NodeMetrics;
  description: string;
  specs?: Record<string, string>;
}

export interface NodeConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  color?: string;
  bidirectional?: boolean;
  curveOffset?: [number, number, number];
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  highlightLines?: number[];
  explanation?: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  hinglishNarration: string;
  whyItMatters: string;
  activeNodeIds: string[];
  activePath?: {
    from: string;
    to: string;
    packetType: PacketType;
    label?: string;
    color?: string;
  } | null;
  nodeStates?: Record<string, NodeState>;
  latencyMs: number;
  cumulativeLatencyMs: number;
  throughputRps: number;
  cacheHitRatio: number;
  codeSnippet?: CodeSnippet;
}

export interface Scenario {
  id: string;
  name: string;
  category: 'System Design' | 'DSA & Algorithms';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tag: string;
  summary: string;
  conceptExplanation: string;
  realWorldExample: string;
  nodes: SystemNode[];
  connections: NodeConnection[];
  steps: SimulationStep[];
}
