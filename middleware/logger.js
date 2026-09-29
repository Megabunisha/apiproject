/**
 * HTTP Request Logger Middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // ANSI Colors for console output
    const statusColor =
      status >= 500 ? '\x1b[31m' : // Red
      status >= 400 ? '\x1b[33m' : // Yellow
      status >= 300 ? '\x1b[36m' : // Cyan
      '\x1b[32m';                  // Green

    const methodColor = '\x1b[35m'; // Magenta
    const resetColor = '\x1b[0m';

    console.log(
      `[${timestamp}] ${methodColor}${req.method}${resetColor} ${req.originalUrl} -> ${statusColor}${status}${resetColor} (${duration}ms)`
    );
  });

  next();
};
