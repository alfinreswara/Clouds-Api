import UserClouds from "../models/UsersClouds.js";
import jwt_decode from "jwt-decode";

const UsageController = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt_decode(token);
    try {   
        const usage = await UserClouds.findAll({
            where: {
                user_id:decoded.userId
            },
            attributes: ["size"]
        })
        res.json(usage);
    } catch (error) {
        console.log(error)
    }
}

export default UsageController;