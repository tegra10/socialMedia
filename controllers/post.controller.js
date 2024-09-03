const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  const post = await postModel.find().select();
  res.status(200).json(post);
};
module.exports.createPost = async (req, res) => {
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
module.exports.updatePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  const updatedRecored = {
    message: req.body.message,
  };

  try {
    const postUpdate = await postModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: updatedRecored,
      },
      { new: true, upsert: true, setDefaultOnInsert: true }
    );

    if (!postUpdate) {
      return res.status(404).send({ message: "utilisater non trouvé" });
    }

    res.status(201).json(postUpdate);
  } catch (err) {
    return res.status(500).send("l'erreur est " + err);
  }
};

module.exports.deletePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  try {
    const post = await postModel.findByIdAndDelete(req.params.id);

    if (!post) {
      res.status(400).json({ message: "le post n'existe pas" });
    }

    res.status(200).json({ message: "Successfuly delete" });
  } catch (err) {
    console.log("l'erreur est " + err);
    res.status(500).json({ message: "message error" });
  }
};
module.exports.likePost = async (req, res) => {
  console.log("Request Body:", req.body); // Pour vérifier le corps de la requête

  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Post ID unknown: " + req.params.id);

  if (!req.body.id) {
    return res.status(400).send("User ID is missing");
  }

  if (!ObjectId.isValid(req.body.id))
    return res.status(400).send("Invalid User ID: " + req.body.id);

  try {
    const likers = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likers: req.body.id } },
      { new: true }
    );

    if (!likers) return res.status(400).send("Post ID unknown");

    const liked = await userModel.findOneAndUpdate(
      { _id: req.body.id },
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );

    if (!liked) {
      console.error("User ID not found:", req.body.id);
      return res.status(404).json({ message: "User ID not found" });
    }

    return res.status(200).json({ liked, likers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports.unLikePost = async (req, res) => {
  console.log("Request Body:", req.body); // Pour vérifier le corps de la requête

  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("Post ID unknown: " + req.params.id);

  try {
    const likers = await postModel.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likers: req.body.id } },
      { new: true }
    );

    if (!likers) return res.status(400).send("Post ID unknown");

    const liked = await userModel.findOneAndUpdate(
      { _id: req.body.id },
      { $pull: { likes: req.params.id } },
      { new: true }
    );

    if (!liked) {
      console.error("User ID not found:", req.body.id);
      return res.status(404).json({ message: "User ID not found" });
    }

    return res.status(200).json({ liked, likers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
