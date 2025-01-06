const functions = require('@google-cloud/functions-framework');
const { Logging } = require('@google-cloud/logging');
const logging = new Logging();

// Register HTTP function
functions.http('summary-webhook', async (req, res) => {
  const log = logging.log('summary-webhook-log');
  
  try {
    // Validate request method
    if (req.method !== 'POST') {
      const error = new Error('Only POST requests are accepted');
      error.code = 405;
      throw error;
    }

    // Validate request body
    if (!req.body || !req.body.text) {
      const error = new Error('Request body must contain a text field');
      error.code = 400;
      throw error;
    }

    // Log incoming request
    const metadata = {
      resource: {
        type: 'cloud_function',
        labels: {
          function_name: 'summary-webhook',
          region: 'us-central1'
        }
      },
      severity: 'INFO'
    };

    await log.write(log.entry(metadata, {
      message: 'Processing summary request',
      textLength: req.body.text.length
    }));

    // Process the text (implement your summary logic here)
    const summary = await processSummary(req.body.text);

    // Send response
    res.status(200).json({
      summary,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    // Log error
    const errorMetadata = {
      resource: {
        type: 'cloud_function',
        labels: {
          function_name: 'summary-webhook',
          region: 'us-central1'
        }
      },
      severity: 'ERROR'
    };

    await log.write(log.entry(errorMetadata, {
      message: 'Error processing request',
      error: error.message,
      stack: error.stack
    }));

    // Send error response
    res.status(error.code || 500).json({
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

async function processSummary(text) {
  // Implement your summary generation logic here
  // This is a placeholder implementation
  return {
    original_length: text.length,
    summary: text.substring(0, Math.min(text.length, 200)) + '...',
    keywords: extractKeywords(text)
  };
}

function extractKeywords(text) {
  // Implement keyword extraction logic
  // This is a placeholder implementation
  const words = text.toLowerCase().split(/\W+/);
  const frequencies = {};
  
  words.forEach(word => {
    if (word && word.length > 3) {
      frequencies[word] = (frequencies[word] || 0) + 1;
    }
  });

  return Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}