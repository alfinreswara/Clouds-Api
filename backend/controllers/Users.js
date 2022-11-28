import Users from "../models/UsersModel.js";
import bcrypy from "bcrypt";
import jwt from "jsonwebtoken";
export const getUsers = async (req, res) => {
    try {
        const user = await Users.findAll();
        res.json(user);
    } catch (error) {
        console.log(error);
    }   
}   

export const Register = async (req, res) => {
    const {name, username, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg : "Password dan Confirm Password tidak sama"});

    const salt = await bcrypy.genSalt();
    const hashPassword = await bcrypy.hash(password, salt);

    try {
        Users.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Register Berhasil"});
    } catch (error) {
            console.log(error);
    }

}

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
        const macth = await bcrypy.compare(req.body.password, user[0].password);
        if(!macth) return res.status(400).json({msg:"wrong password"});
        const userId = user[0].id;
        const name = user[0].name;
        const username = user[0].username;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, username, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, username, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken}, { 
            where:{
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
        } catch (error) {
            console.log(error);
        res.status(400).json({msg:"email tidak ditemukan"})
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) res.sendStatus(403);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if(!user[0]) res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null}, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    res.sendStatus(200);
}

export const dashboard = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
        where: {
            refresh_token : refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(403);
    res.sendStatus(200);
  } catch (error) {
    console.log(error)
    
  }
}