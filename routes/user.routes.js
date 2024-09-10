const express = require("express");
const multer = require("multer");
const path = require("path");

const { signUp, signIn, logOut } = require("../controllers/auth.controller");
const {
  getAllUsers,
  userInfo,
  updateUser,
  deleteUser,
  follow,
  unFollow,
} = require("../controllers/user.controller");
const { uploadPicture } = require("../controllers/upload.controller");

const router = express.Router();

// Configuration de Multer pour gérer les téléchargements de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Assurez-vous que le dossier 'uploads' existe dans votre projet
    const uploadPath = path.join(__dirname, "../public/uploads"); // Adaptez le chemin si nécessaire
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Routes d'authentification
router.post("/register", signUp);
router.post("/login", signIn);
router.get("/logout", logOut);

// Routes pour gérer les utilisateurs
router.get("/", getAllUsers);
router.get("/:id", userInfo);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unFollow);

// Route pour télécharger un fichier
router.post("/upload", upload.single("file"), uploadPicture);

module.exports = router;
