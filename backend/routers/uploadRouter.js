import multer from "multer";
import express from "express";
import { isAuth } from "../utils.js";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(request, file, cb) {
    //cb stands for callback
    cb(null, "uploads"); //--> images will be saved in a folder called 'uploads'
  },
  filename(request, file, cb) {
    cb(null, `${Date.now()}.jpg`); //---> Date.now().jpg === name of file/image
  },
});

//upload middleware
const upload = multer({ storage });

// ('/')---> final path === /api/uploads
uploadRouter.post("/", isAuth, upload.single("image"), (request, response) => {
  response.send(`/${request.file.path}`);
});

export default uploadRouter;
