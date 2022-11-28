import express from "express";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";


dotenv.config()
const app = express();

try {
    await db.authenticate();
    console.log('database connected....');
} catch (error) {
    console.log(error)
}
let opsion = {
    dotfiles: "ignore",
    etag: true,
    extensions: ["htm", "html"],
    index: false,
    maxAge: "7d",
    redirect: false,
    setHeaders: function(res, path, stat){
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.set('X-timestamp', Date.now());
    }
}

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('upload', opsion));
app.use(router);

app.listen('5000' , (err) => {
if(err) throw err
console.log('http://localhost:5000');
})