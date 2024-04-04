const path = require("path");

const renderTask3View = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/task3/Tic-Tac-Toe.html"));
  } catch (error) {
    console.log(error);
    return res.send("Something Went Wrong");
  }
};

module.exports = { renderTask3View };
