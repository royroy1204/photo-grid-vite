// This API route retrieves all submissions from Vercel storage

export default async function handler(req, res) {
  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check for basic authentication (in production, use a more secure method)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Decode base64 auth header
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [username, password] = auth.split(':');
    
    // Very basic auth check (use environment variables in production)
    if (username !== 'admin' || password !== (process.env.ADMIN_PASSWORD || 'slaviaadmin')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Fetch submissions from Vercel KV (if using KV storage)
    let submissions = [];
    
    // If using Vercel KV:
    /*
    const { kv } = require('@vercel/kv');
    const submissionIds = await kv.lrange('recent_submissions', 0, -1);
    
    if (submissionIds && submissionIds.length > 0) {
      // Get all submissions in parallel
      const submissionPromises = submissionIds.map(id => kv.get(id));
      const submissionData = await Promise.all(submissionPromises);
      
      submissions = submissionIds.map((id, index) => ({
        id,
        ...submissionData[index]
      })).filter(Boolean);
    }
    */
    
    // Return all submissions
    return res.status(200).json({ 
      submissions
    });
    
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve submissions',
      message: error.message 
    });
  }
} 