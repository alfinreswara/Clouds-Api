import UserClouds from "../models/UsersClouds.js";

const DownloadController = async (req, res) => {
    const p = req.params.path;
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    console.log(p);
    try {
        const user = await UserClouds.findAll({
            where: {
                pathFile: p
            }
        });
        const fil = `./upload/${user[0].url}`;
        res.download(fil);
    } catch (error) {
        res.json({msg: "bawokx"})
    }
}

export default DownloadController;