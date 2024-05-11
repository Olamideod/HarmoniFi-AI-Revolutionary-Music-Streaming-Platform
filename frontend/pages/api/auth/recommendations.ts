import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { song } = req.body; // Extract song from request body

  try {
    // Make a GET request to the Flask server
    const response = await axios.get('http://localhost:5000/recommendations', {
      params: { song } // Pass song as a parameter in the params object
    });

    // Send the recommendations as the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error when calling Flask server:', error.message);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}
