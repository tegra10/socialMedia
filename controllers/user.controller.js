const userModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;
module.exports.getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send("ID unknown " + req.params.id);

    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).send("ID unknown " + req.params.id);
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("l'erreur est " + err);
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  try {
    const userUpdate = await userModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultOnInsert: true }
    );

    if (!userUpdate) {
      return res.status(404).send({ message: "utilisater non trouvé" });
    }

    res.status(201).json(userUpdate);
  } catch (err) {
    return res.status(500).send("l'erreur est " + err);
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .send("ID unknown " + req.params.id + "or" + req.body.idToFollow);
  try {
    const post = await userModel.findByIdAndDelete(req.params.id);

    if (!post) {
      res.status(400).json({ message: "le post n'existe pas" });
    }

    res.status(200).json({ message: "Successfuly delete " });
  } catch (err) {
    console.log("l'erreur est " + err);
    res.status(500).json({ message: "message error" });
  }
};

module.exports.follow = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  try {
    console.log("ID de l'utilisateur qui suit : ", req.params.id);
    console.log("ID de l'utilisateur à suivre : ", req.body.idToFollow);

    // Ajout à followers
    const follower = await userModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: req.body.idToFollow } },
      { new: true, upsert: true }
    );

    if (!follower) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    console.log("Followers après ajout : ", follower.followers);

    // Ajout à following
    const following = await userModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { following: req.params.id } },
      { new: true, upsert: true }
    );

    if (!following) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    console.log("Following après ajout : ", following.following);

    res.status(200).json({ follower, following });
  } catch (err) {
    console.log("L'erreur est : " + err);
    res.status(500).json({ message: "Message d'erreur : " + err });
  }
};

module.exports.unFollow = async (req, res) => {
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnFollow)
  ) {
    return res
      .status(400)
      .send("ID inconnu: " + req.params.id + " ou " + req.body.idToUnFollow);
  }

  try {
    console.log("ID de l'utilisateur qui ne suit plus : ", req.params.id);
    console.log(
      "ID de l'utilisateur à ne plus suivre : ",
      req.body.idToUnFollow
    );

    // Retirer de followers
    const follower = await userModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.body.idToUnFollow } },
      { new: true }
    );

    if (!follower) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    console.log("Followers après retrait : ", follower.followers);

    // Retirer de following
    const following = await userModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      { $pull: { following: req.params.id } },
      { new: true }
    );

    if (!following) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    console.log("Following après retrait : ", following.following);

    res.status(200).json({ follower, following });
  } catch (err) {
    console.log("L'erreur est : " + err);
    res.status(500).json({ message: "Erreur : " + err });
  }
};
