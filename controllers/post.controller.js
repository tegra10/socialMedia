const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  //   postModel.find((err, docs) => {
  //     if (!err) return res.send(docs);
  //     else console.log("Error to get data: " + err);
  //   });

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
module.exports.updatePost = async (req, res) => {};
module.exports.deletePost = async (req, res) => {};
