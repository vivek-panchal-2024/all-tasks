const path = require("path");

const renderTask5View = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/task5/Events.html"));
  } catch (error) {
    console.log(error);
    return res.send("Something Went Wrong");
  }
};

module.exports = { renderTask5View };
