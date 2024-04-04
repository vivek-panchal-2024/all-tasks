const path = require("path");

const renderTask2View = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../views/task2/Kuku_Kube.html"));
  } catch (error) {
    console.log(error);
    return res.send("Something Went Wrong");
  }
};

module.exports = { renderTask2View };
