import TrashUser from "../models/TrashUsers.js";
import UserClouds from "../models/UsersClouds.js";
import jwt_decode from "jwt-decode";
import fs from "fs/promises"

export const getTrashFile = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt_decode(token);
    const p = decoded.userId
   try {
    const trash = await TrashUser.findAll({
        where: {
            user_id: p
        }
    })
    res.json(trash);
   } catch (error) {   
    console.log(error)
   }
}

export const restoreFile = async (req, res) => {
    const path = req.params.path;
    try {
       const as = await TrashUser.findOne({
            where: {
                pathFile: path
            }
        })
        await TrashUser.destroy({
            where: {
                pathFile: path
            }
        })
        const { name, author, typeFile, pathFile, url, user_id, size } = as;
        await UserClouds.create({
            name, author, typeFile, pathFile, url, user_id, size
        })

        res.json({msg: "berhasil restore"})
    } catch (error) {
        res.json({msg: error})
    }
}   

export const deleteFilesPer = async (req, res) => {
    const path = req.params.path;
    const un = req.params.un;
    try {
        await TrashUser.destroy({
            where: {
                name: path
            }
        })
        fs.rm(`upload/${un}/${path}`, { recursive:true },function(err) {
            console.log(err)
            console.log("eooooooooooooooooooooooooooooooooooooooooooooox`")
        })
        res.json({msg:"file deleted permanent successfully"})
    } catch (error) {
        
    }
}