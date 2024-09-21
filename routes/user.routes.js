const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp"); // Assurez-vous d'installer sharp via npm
const UserModel = require("../models/user.model");
const { signUp, signIn, logOut } = require("../controllers/auth.controller");
const {
  getAllUsers,
  userInfo,
  updateUser,
  deleteUser,
  follow,
  unFollow,
} = require("../controllers/user.controller");
const { uploadErrors } = require("../utils/errors.utils");

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
    cb(new Error("Format incorrect"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route pour télécharger un fichier
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = req.body.userId; // Assurez-vous que l'ID de l'utilisateur est passé dans le corps de la requête
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const outputPath = path.join(
      __dirname,
      "../client/public/uploads/profil",
      `${req.body.name}.jpg`
    );

    // Convertir l'image en JPG et enregistrer
    await sharp(req.file.buffer).jpeg().toFile(outputPath);
    user.picture = `uploads/profil/${req.body.name}.jpg`; // Modifiez cela selon votre structure de document
    await user.save();
    // Appeler votre fonction uploadPicture si nécessaire
    // await uploadPicture(req, res); // Décommentez si vous avez besoin d'appeler cette fonction
    console.log("File uploaded successfully!");

    res.status(200).json({ user });
  } catch (err) {
    const errors = uploadErrors(err);
    console.log(err);

    res.status(500).json(errors);
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
