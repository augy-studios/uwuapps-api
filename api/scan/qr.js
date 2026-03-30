const { success, error, handleCors } = require('../../lib/response');

// Vercel config: allow raw body for file uploads
module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }

  // Forward the raw multipart body directly to QR Server API
  // Vercel provides req as a Node.js IncomingMessage — pipe it through
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return error(res, 'Request must be multipart/form-data with a "file" field.');
  }

  let responseData;
  try {
    // Collect raw body chunks
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      headers: {
        'Content-Type': contentType, // pass boundary through unchanged
      },
      body: rawBody,
    });

    if (!response.ok) {
      return error(res, `QR Server API returned status ${response.status}.`, 502);
    }

    responseData = await response.json();
  } catch (err) {
    return error(res, 'Failed to reach QR Server API. Please try again.', 502);
  }

  const decoded = responseData?.[0]?.symbol?.[0]?.data;

  if (!decoded) {
    return res.status(422).json({
      success: false,
      message: "Couldn't decode QR code. Make sure the image contains a valid QR code.",
    });
  }

  return success(res, { decoded });
};

// Disable Vercel's default body parser so we can handle raw multipart
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
