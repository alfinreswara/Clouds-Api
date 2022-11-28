import UserClouds from "../models/UsersClouds.js";
import TrashUser from "../models/TrashUsers.js";
const DelFile =  async (req, res) => {
const path = req.params.path
    try {
        const trash = await UserClouds.findOne({
            where: {
                pathFile: path
            }
        });
      await UserClouds.destroy({
            where: {
                pathFile: path
            }
        })
        const { name, author, typeFile, pathFile, url, user_id, size } = trash;
        const timeNow = Date.now();
        console.log(timeNow)
     await TrashUser.create({
        name, author, typeFile, pathFile, url, user_id, size, create: timeNow
     })

        res.json({msg:"Delete sucsess"});

    
    } catch (error) {

    }
}

export default DelFile;