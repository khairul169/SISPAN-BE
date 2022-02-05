const success = (res, result) => {
  return res.json({
    success: true,
    result,
  });
};

const error = (res, message, errCode = 500) => {
  return res.status(errCode).json({
    success: false,
    message,
  });
};

const response = {
  success,
  error,
};

module.exports = response;
