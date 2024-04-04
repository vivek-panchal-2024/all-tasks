const path = require("path");

const renderTask1View = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/task1/DynamicTable.html"));
  } catch (error) {
    console.log(error);
    return res.send("Something Went Wrong");
  }
};

module.exports = { renderTask1View };
