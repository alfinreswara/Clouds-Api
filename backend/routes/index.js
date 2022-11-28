import express from "express";
import {
  getUsers,
  Register,
  Login,
  Logout,
  dashboard,
} from "../controllers/Users.js";
import uploadController from "../controllers/uploadscontrollers.js";
import { verifyToken } from "../middleware/verfyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { tes } from "../controllers/Dashboard.js";
import fileController from "../controllers/FileControllers.js";
import DownloadController from "../controllers/DownloadController.js";
import UsageController from "../controllers/UsageController.js";
import DelFile from "../controllers/DeleteControllers.js";
import { deleteFilesPer, getTrashFile, restoreFile } from "../controllers/TrashControllers.js";

const router = express.Router();

router.post("/pt", tes);

router.get("/token", refreshToken);

router.get("/users", verifyToken, getUsers);

router.post("/register", Register);

router.post("/login", Login);

router.get("/dashboard", dashboard);

router.post("/uploadfile", verifyToken, uploadController);

router.get("/myfile", verifyToken, fileController);

router.get("/download/clouds/:path", DownloadController);

router.get("/getUsage", verifyToken, UsageController);

router.get("/getTrashfiles", verifyToken, getTrashFile);

router.get("/restore/:path", verifyToken, restoreFile);


// DELETE
router.delete("/logout", Logout);
router.delete("/delete/:path", DelFile);
router.delete("/del/:un/:path", verifyToken, deleteFilesPer);
export default router;
