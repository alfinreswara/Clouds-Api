import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const {DataTypes} = Sequelize;

const TrashUser = db.define('TrashUser', {
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
},
    create:{
        type: DataTypes.STRING,
    }
},{
freezeTableName:true
});


export default TrashUser;