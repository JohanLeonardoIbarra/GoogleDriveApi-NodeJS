const driveApi = require("../../drive/driveapi");

module.exports = async(req, res) => {
    const file = req.file;
    try {
        const response = await driveApi(file);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}