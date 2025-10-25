# Hive Desktop Widget - API Reference

## IPC Communication API

### Window Management

#### `minimize-window`
Minimize the Electron window.

```typescript
window.electronAPI.minimizeWindow();
```

**Type:** Event (no return value)

---

#### `close-window`
Hide the window (closes to system tray, doesn't quit app).

```typescript
window.electronAPI.closeWindow();
```

**Type:** Event (no return value)

---

### Agent Management

#### `execute-task`
Execute a task through the agent orchestrator.

```typescript
const result = await window.electronAPI.executeTask(taskName: string);

// Returns
{
  success: boolean;
  data?: string;        // Task result on success
  error?: string;       // Error message on failure
}
```

**Parameters:**
- `taskName` (string): Name of the task to execute
  - Examples: "plan", "research", "write", "analyze", "debug", "validate"

**Returns:** Promise<{ success: boolean; data?: string; error?: string }>

**Example:**
```typescript
try {
  const result = await window.electronAPI.executeTask('research');
  if (result.success) {
    console.log('Task completed:', result.data);
  } else {
    console.error('Task failed:', result.error);
  }
} catch (error) {
  console.error('IPC error:', error);
}
```

---

#### `get-agent-status`
Fetch the current status of all agents and the queen bee.

```typescript
const status = await window.electronAPI.getAgentStatus();

// Returns
{
  queenStatus: 'Coordinating Tasks' | 'Idle' | 'Processing';
  workers: Array<{
    id: string;           // 'w1', 'w2', ..., 'w6'
    name: string;         // 'Planner', 'Researcher', ...
    status: 'idle' | 'working' | 'completed';
    currentTask?: string;
  }>;
  taskQueue: string[];
}
```

**Returns:** Promise<AgentStatus>

**Example:**
```typescript
const status = await window.electronAPI.getAgentStatus();

// Display queen status
console.log(`Queen: ${status.queenStatus}`);

// Count active workers
const activeCount = status.workers.filter(w => w.status === 'working').length;
console.log(`Active workers: ${activeCount}/${status.workers.length}`);

// Check task queue
console.log(`Queued tasks: ${status.taskQueue.length}`);
```

---

#### `agent-update` (Event Listener)
Listen for real-time agent status updates.

```typescript
window.electronAPI.onAgentUpdate((status: AgentStatus) => {
  console.log('Agent status updated:', status);
});
```

**Parameters:**
- Callback function receiving updated AgentStatus

**Example:**
```typescript
useEffect(() => {
  window.electronAPI.onAgentUpdate((status) => {
    updateStatus(status);
  });
}, []);
```

---

## Agent Orchestrator API

### Backend (Node.js + LangChain)

#### `agentOrchestrator.executeTask(taskName: string)`

Execute a task through one of the worker agents.

```typescript
try {
  const result = await agentOrchestrator.executeTask('plan');
  console.log(result);  // "Task 'plan' completed by Planner"
} catch (error) {
  console.error('Task execution failed:', error);
}
```

**Workflow:**
1. Set Queen status to 'Processing'
2. Find first available idle worker
3. Mark worker as 'working'
4. Execute task (or LLMChain)
5. Mark worker as 'completed'
6. Remove from task queue
7. Set Queen back to 'Idle' if no tasks pending

**Supported Tasks:**
- `'plan'` → Planner agent
- `'research'` → Researcher agent
- `'write'` → Writer agent
- `'analyze'` → Analyst agent
- `'debug'` → Debugger agent
- `'validate'` → Validator agent

**Returns:** Promise<string>

---

#### `agentOrchestrator.getStatus()`

Get current orchestrator status.

```typescript
const status = agentOrchestrator.getStatus();
console.log(status.queenStatus);
```

**Returns:** AgentStatus object

---

#### `agentOrchestrator.updateWorkerStatus(workerId: string, status: WorkerStatus)`

Manually update a worker's status.

```typescript
agentOrchestrator.updateWorkerStatus('w1', 'working');
```

**Parameters:**
- `workerId` (string): Worker ID ('w1' - 'w6')
- `status` ('idle' | 'working' | 'completed')

---

## Type Definitions

### AgentStatus

```typescript
interface AgentStatus {
  queenStatus: 'Coordinating Tasks' | 'Idle' | 'Processing';
  workers: Worker[];
  taskQueue: string[];
}
```

### Worker

```typescript
interface Worker {
  id: string;              // 'w1' through 'w6'
  name: string;            // Agent name
  status: WorkerStatus;    // Current status
  currentTask?: string;    // Current task name (if working)
}

type WorkerStatus = 'idle' | 'working' | 'completed';
```

### Execution Result

```typescript
interface ExecutionResult {
  success: boolean;
  data?: string;    // Result on success
  error?: string;   // Error message on failure
}
```

---

## State Management (Zustand)

### useAgentStore Hook

```typescript
import { useAgentStore } from '@/stores/agentStore';

// In React component
const { status, updateStatus, updateWorkerStatus } = useAgentStore();

// Access state
console.log(status.queenStatus);
console.log(status.workers);

// Update status
updateStatus(newStatus);

// Update individual worker
updateWorkerStatus('w1', 'working');
```

**Store Interface:**

```typescript
interface AgentStore {
  status: AgentStatus;
  updateStatus: (status: AgentStatus) => void;
  updateWorkerStatus: (workerId: string, newStatus: WorkerStatus) => void;
}
```

---

## LLMChain Integration

### Adding a New LLMChain

In `src/backend/agents.ts`:

```typescript
private initializeChains() {
  const myTemplate = `You are a [role].
Topic: {input}
Please provide [output format].`;

  const prompt = new PromptTemplate({
    template: myTemplate,
    inputVariables: ['input'],
  });

  this.taskChains.set('mytask', new LLMChain({
    llm: this.llm,
    prompt: prompt,
  }));
}
```

### Using LLMChains in Tasks

```typescript
async executeTask(taskName: string): Promise<string> {
  const chain = this.taskChains.get(taskName);
  if (chain) {
    const result = await chain.call({ input: 'your input' });
    return result.text;
  }
  throw new Error(`Task '${taskName}' not found`);
}
```

---

## Error Handling

### Common Errors

#### "window.electronAPI is undefined"

```
Cause: Preload script not loaded or contextIsolation issue
Fix: Check main.ts webPreferences:
  - preload: correct path
  - contextIsolation: true
  - nodeIntegration: false
```

#### "IPC timeout"

```
Cause: Main process not listening for event
Fix: Verify ipcMain handler registered in main.ts
```

#### "Task execution failed: OPENAI_API_KEY not set"

```
Cause: Missing environment variable
Fix: Create .env file with OPENAI_API_KEY=sk-...
```

---

## Example: Complete Flow

### Step 1: User clicks worker cell

```typescript
// HexCell.tsx
<button onClick={() => onClick()} />
```

### Step 2: Execute task via IPC

```typescript
// HoneycombGrid.tsx
const handleWorkerClick = async (worker) => {
  const result = await window.electronAPI.executeTask('research');
  console.log(result);  // { success: true, data: "Task completed..." }
};
```

### Step 3: Main process routes to agent

```typescript
// main.ts
ipcMain.handle('execute-task', async (_event, taskName) => {
  try {
    const result = await agentOrchestrator.executeTask(taskName);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
```

### Step 4: Agent executes task

```typescript
// agents.ts
async executeTask(taskName: string): Promise<string> {
  // Find available worker
  const worker = this.status.workers.find(w => w.status === 'idle');
  
  if (worker) {
    worker.status = 'working';
    
    // Execute chain
    const chain = this.taskChains.get(taskName);
    const result = await chain.call({ input: 'data' });
    
    worker.status = 'completed';
    return `Task completed: ${result.text}`;
  }
}
```

### Step 5: UI updates with new status

```typescript
// App.tsx
useEffect(() => {
  window.electronAPI.onAgentUpdate((status) => {
    updateStatus(status);  // Updates Zustand store
  });
}, []);
```

---

## Performance Tips

### Batch Updates

```typescript
// Don't update one by one
for (let i = 0; i < workers.length; i++) {
  updateWorkerStatus(workers[i].id, 'working');  // Bad
}

// Do batch update
const newStatus = {
  ...status,
  workers: workers.map(w => ({ ...w, status: 'working' }))
};
updateStatus(newStatus);  // Good
```

### Memoize Components

```typescript
// Prevent unnecessary re-renders
const HexCell = React.memo(({ worker, onClick }) => {
  return <button onClick={onClick}>{worker.name}</button>;
});
```

### Debounce Updates

```typescript
import { useCallback } from 'react';
import { debounce } from 'lodash';

const debouncedUpdate = useCallback(
  debounce((status) => updateStatus(status), 300),
  []
);
```

---

## Testing with DevTools

```javascript
// In Electron DevTools console (F12)

// Test IPC
window.electronAPI.executeTask('plan')
  .then(r => console.log('Success:', r))
  .catch(e => console.error('Error:', e));

// Check status
window.electronAPI.getAgentStatus()
  .then(s => console.table(s.workers));

// Listen for updates
let count = 0;
window.electronAPI.onAgentUpdate(() => {
  console.log(`Update ${++count}`);
});
```

---

For more details, see README.md and SETUP.md