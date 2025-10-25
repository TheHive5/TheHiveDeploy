import { create } from 'zustand';

interface Worker {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'completed';
  currentTask?: string;
}

interface AgentStatus {
  queenStatus: 'Coordinating Tasks' | 'Idle' | 'Processing';
  workers: Worker[];
  taskQueue: string[];
}

interface AgentStore {
  status: AgentStatus;
  updateStatus: (status: AgentStatus) => void;
  updateWorkerStatus: (workerId: string, newStatus: 'idle' | 'working' | 'completed') => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  status: {
    queenStatus: 'Idle',
    workers: [],
    taskQueue: [],
  },

  updateStatus: (status) =>
    set({ status }),

  updateWorkerStatus: (workerId, newStatus) =>
    set((state) => ({
      status: {
        ...state.status,
        workers: state.status.workers.map((w) =>
          w.id === workerId ? { ...w, status: newStatus } : w,
        ),
      },
    })),
}));