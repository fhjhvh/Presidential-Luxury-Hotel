export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Resource already exists',
      field: err.meta?.target,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
