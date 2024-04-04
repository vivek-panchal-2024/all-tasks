let id = 0;
const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

module.exports = { generateId };
