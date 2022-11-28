import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
const {DataTypes} = Sequelize;

const UserClouds = db.define('cloudsFile', {
    name: {
        type: DataTypes.STRING
},
    author: {
        type:DataTypes.STRING
},
    typeFile: {
        type: DataTypes.STRING,
},
    pathFile: {
        type: DataTypes.STRING
},
    url: {
        type: DataTypes.STRING,
        unique: true
},
    user_id: {
        type: DataTypes.INTEGER
},
    size: {
        type: DataTypes.INTEGER
}
},{
freezeTableName:true
});
export default UserClouds;

