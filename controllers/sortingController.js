const path = require("path");

const renderTask4View = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/task4/Sorting.html"));
  } catch (error) {
    console.log(error);
    return res.send("Something Went Wrong");
  }
};

module.exports = { renderTask4View };
