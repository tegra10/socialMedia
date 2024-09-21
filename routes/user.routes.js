const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp"); // Assurez-vous d'installer sharp via npm

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
const storage = multer.memoryStorage(); // Utiliser memoryStorage pour traiter l'image avant de l'enregistrer

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/; // Formats autorisés
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route pour télécharger un fichier
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const outputPath = path.join(
      __dirname,
      "../client/public/uploads/profil",
      `${req.body.name}.jpg`
    );

    // Convertir l'image en JPG et enregistrer
    await sharp(req.file.buffer).jpeg().toFile(outputPath);
    // Appeler votre fonction uploadPicture si nécessaire
    // await uploadPicture(req, res); // Décommentez si vous avez besoin d'appeler cette fonction

    res.status(200).json({ message: "File uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
module;

module.exports = router;
