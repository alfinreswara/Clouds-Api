import UserClouds from "../models/UsersClouds.js";


export const tes = async (req, res) => {
    const {name, url, user_id} = req.body;
    try {
         await UserClouds.create({
            name: name,
            url:url,
            user_id: user_id
        });
        res.json({msg:"berhasil"})
    } catch (error) {
        console.log(error)
    }
}