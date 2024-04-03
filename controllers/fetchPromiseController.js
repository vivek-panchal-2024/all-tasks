const path = require("path");

const renderUserPosts = (req, res)=>{
    res.sendFile(path.join(__dirname, '../views/task11/index.html'));
}

const renderSpecificUserPosts = (req, res)=>{
    res.sendFile(path.join(__dirname, '../views/task11/user_posts.html'));
}

module.exports = {renderUserPosts,renderSpecificUserPosts};