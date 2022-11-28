import multer from "multer";
import fs from "fs";
import UserClouds from "../models/UsersClouds.js";
const uploadController = async (req, res) => {
 const uniqName = Date.now();
  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      var dir = `./upload/${req.body.username}`;
      if (!fs.existsSync(dir)){
         fs.mkdirSync(dir);
        } 
      cb(null, `upload/${req.body.username}`);
    }, 
    filename: function(req, file, cb){
      cb(null, uniqName + file.originalname);
    }
  })
  
  // const type = upload.single('dataUser') ;
  const upload = multer({storage: storage}).single('dataUser');
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.json({msg: "an error occurred while uploading"})
        } else if (err) {
          // An unknown error occurred when uploading.
          res.json({msg: "Error Uploading"})
        }
       
     const { userId, username } = req.body;
     const name = uniqName + req.file.originalname;
      try {
          await UserClouds.create({
            name : name,
            author: username,
            typeFile: req.file.mimetype,
            pathFile: `${username}${name}`,
            url: `${username}/${name}`,
            user_id: userId,
            size: req.file.size
          })
        } catch (error) { 
          res.json({msg: error})
        }   
    res.json({msg: "uploading SuccessFully"})
        // Everything went fine.
        console.log(req.body.username)
      })
}


export default uploadController;