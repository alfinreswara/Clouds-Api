import UserClouds from "../models/UsersClouds.js";
import jwt_decode from "jwt-decode";

const fileController = async (req, res) => {
    // const { userId } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt_decode(token);
    try {
        const fileUser = await UserClouds.findAll({ 
            where: {
                user_id: decoded.userId
            }, order: [
                ['id', 'DESC']
            ]
    })
        res.json(fileUser);
    } catch (error) {
        res.json({msg: error});
    }
}

export default fileController;