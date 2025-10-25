import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Agent definitions
const AGENTS = {
  1: { name: 'Planner', role: 'Strategic Planning' },
  2: { name: 'Writer', role: 'Content Creation' },
  3: { name: 'Researcher', role: 'Information Gathering' },
  4: { name: 'Analyst', role: 'Data Analysis' },
  5: { name: 'Designer', role: 'Visual Design' },
  6: { name: 'Developer', role: 'Code Implementation' }
};

// Simple mock implementation - replace with LangChain + OpenAI later
const processTask = async (task, agentId) => {
  const agent = AGENTS[agentId];
  
  // TODO: Replace with real OpenAI API call via LangChain
  // For now, return a mock response
  return `[${agent.name}] Processing: "${task}"`;
};

// API endpoint
app.post('/api/task', async (req, res) => {
  try {
    const { task, agentId } = req.body;
    
    if (!task || !agentId) {
      return res.status(400).json({ error: 'Missing task or agentId' });
    }
    
    const result = await processTask(task, agentId);
    res.json({ result });
  } catch (error) {
    console.error('Error processing task:', error);
    res.status(500).json({ error: 'Failed to process task' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured' : 'NOT SET'}`);
});