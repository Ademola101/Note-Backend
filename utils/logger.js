const info = (...params) => {
  if (process.env.NODE !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE !== 'test') {
    console.log(...params);
  }
};

module.exports = {
  info,
  error,
};
