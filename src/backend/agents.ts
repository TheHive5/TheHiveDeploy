import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';

interface AgentStatus {
  queenStatus: 'Coordinating Tasks' | 'Idle' | 'Processing';
  workers: {
    id: string;
    name: string;
    status: 'idle' | 'working' | 'completed';
    currentTask?: string;
  }[];
  taskQueue: string[];
}

class HiveAgentOrchestrator {
  private status: AgentStatus;
  private llm: ChatOpenAI | null = null;
  private taskChains: Map<string, LLMChain> = new Map();

  constructor() {
    this.status = {
      queenStatus: 'Idle',
      workers: [
        { id: 'w1', name: 'Planner', status: 'idle' },
        { id: 'w2', name: 'Researcher', status: 'idle' },
        { id: 'w3', name: 'Writer', status: 'idle' },
        { id: 'w4', name: 'Analyst', status: 'idle' },
        { id: 'w5', name: 'Debugger', status: 'idle' },
        { id: 'w6', name: 'Validator', status: 'idle' },
      ],
      taskQueue: [],
    };
  }

  private getLLM(): ChatOpenAI {
    if (!this.llm) {
      this.llm = new ChatOpenAI({
        temperature: 0.7,
        modelName: 'gpt-3.5-turbo',
      });
      this.initializeChains();
    }
    return this.llm;
  }

  private initializeChains() {
    // Example chains for different workers
    const plannerTemplate = `You are a planning agent. Break down the following task into subtasks:
Task: {task}
Please provide a structured plan.`;

    const researcherTemplate = `You are a research agent. Research the following topic and provide key insights:
Topic: {topic}
Please provide 5 key findings.`;

    const writerTemplate = `You are a writing agent. Write content about the following:
Topic: {topic}
Length: 3 paragraphs`;

    const templates = {
      planner: new PromptTemplate({
        template: plannerTemplate,
        inputVariables: ['task'],
      }),
      researcher: new PromptTemplate({
        template: researcherTemplate,
        inputVariables: ['topic'],
      }),
      writer: new PromptTemplate({
        template: writerTemplate,
        inputVariables: ['topic'],
      }),
    };

    const llm = this.getLLM();
    this.taskChains.set('plan', new LLMChain({ llm, prompt: templates.planner }));
    this.taskChains.set('research', new LLMChain({ llm, prompt: templates.researcher }));
    this.taskChains.set('write', new LLMChain({ llm, prompt: templates.writer }));
  }

  async executeTask(taskName: string): Promise<string> {
    this.status.queenStatus = 'Processing';
    this.status.taskQueue.push(taskName);

    try {
      // Assign task to first available worker
      const availableWorker = this.status.workers.find(w => w.status === 'idle');
      if (availableWorker) {
        availableWorker.status = 'working';
        availableWorker.currentTask = taskName;

        // Simulate work (in real scenario, would execute actual LLMChain)
        await new Promise(resolve => setTimeout(resolve, 2000));

        availableWorker.status = 'completed';
        availableWorker.currentTask = undefined;
      }

      this.status.taskQueue = this.status.taskQueue.filter(t => t !== taskName);

      if (this.status.taskQueue.length === 0) {
        this.status.queenStatus = 'Idle';
      }

      return `Task "${taskName}" completed by ${availableWorker?.name}`;
    } catch (error) {
      this.status.queenStatus = 'Idle';
      throw error;
    }
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  updateWorkerStatus(workerId: string, status: 'idle' | 'working' | 'completed'): void {
    const worker = this.status.workers.find(w => w.id === workerId);
    if (worker) {
      worker.status = status;
    }
  }
}

const agentOrchestrator = new HiveAgentOrchestrator();
module.exports = { agentOrchestrator };