// This is a serverless function that runs on Vercel
// It stores submission data in Vercel's KV storage or logs to Vercel's logs

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the submission data from the request body
    const submission = req.body;
    
    // Add timestamp if not already present
    if (!submission.timestamp) {
      submission.timestamp = new Date().toISOString();
    }
    
    // Add a unique ID based on timestamp
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Log the submission to Vercel logs (these will be visible in the Vercel dashboard)
    console.log(`New submission received [${submissionId}]:`, JSON.stringify(submission));
    
    // If you want to store in a database, you can use Vercel KV, Postgres, or other Vercel integrations
    // Example with Vercel KV (you would need to set this up in your Vercel dashboard first):
    /*
    const { kv } = require('@vercel/kv');
    await kv.set(submissionId, submission);
    await kv.lpush('recent_submissions', submissionId);
    */
    
    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Submission saved successfully',
      submissionId
    });
    
  } catch (error) {
    console.error('Error processing submission:', error);
    return res.status(500).json({ 
      error: 'Failed to process submission',
      message: error.message 
    });
  }
} 