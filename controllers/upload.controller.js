const UserModel = require("../models/user.model");

const uploadPicture = async (req, res) => {
  
  try {
    const { id, name } = req.body; // Récupérer l'ID et le nom du corps de la requête

    // Vérifiez que l'utilisateur avec cet ID existe
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé.");
    }
    // Mettre à jour le chemin de l'image dans le document utilisateur
    user.profilePicture = `../client/public/uploads/profil/${name}`; // Assurez-vous que cela correspond à votre structure de chemin
    await user.save();

    res.status(200).send(`mage téléchargée avec succès : ${name}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors du téléchargement de l'image.");
  }
};

module.exports = { uploadPicture };
