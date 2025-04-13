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
    
    // Store in Vercel KV
    try {
      const { kv } = require('@vercel/kv');
      
      // Store the submission data with the submission ID as key
      await kv.set(submissionId, submission);
      
      // Add the submission ID to a list of recent submissions
      await kv.lpush('recent_submissions', submissionId);
      
      // Set expiration for 90 days (in seconds)
      const EXPIRATION_DAYS = 90;
      await kv.expire(submissionId, 60 * 60 * 24 * EXPIRATION_DAYS);
      
      console.log(`Submission saved to KV with ID: ${submissionId}`);
    } catch (kvError) {
      console.error('KV error:', kvError);
      // Continue even if KV fails, as we still want to return success to the user
    }
    
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