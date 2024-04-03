const renderTimeZoneView = (req, res)=>{
    try {
        res.render("./task15/TimeZone");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {renderTimeZoneView};