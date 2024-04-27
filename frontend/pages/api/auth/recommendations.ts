import { NextApiRequest, NextApiResponse } from 'next';
const { spawn } = require('child_process');
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userPreferences } = req.body; // Replace with appropriate user data

  try {
    // Prepare Python script execution with user preferences
    const pythonProcess = spawn('python', ['http://localhost:5000/recommendation_backend/app.py', JSON.stringify(userPreferences)]);

    // Capture stdout data (recommendations)
    let recommendations = '';
    pythonProcess.stdout.on('data', (data) => {
      recommendations += data.toString();
    });

    // Handle errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error('Error from Python script:', data.toString());
      res.status(500).json({ error: 'Failed to generate recommendations' });
    });

    // Send recommendations to the frontend once Python execution is complete
    pythonProcess.on('close', (code) => {
      if (code === 0) { // Success code from Python
        res.status(200).json(JSON.parse(recommendations));
      } else {
        res.status(500).json({ error: 'Failed to generate recommendations' });
      }
    });
  } catch (error) {
    console.error('Error during Python execution:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}