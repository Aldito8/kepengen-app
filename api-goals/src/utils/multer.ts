import multer from "multer";
import path from "path";
import { storage } from "./cloudinary";

const fileFilter = (
    req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png"];
    if (!allowed.includes(ext)) {
        return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2,
    },
});
