module.exports.uploadPicture = (req, res) => {
  (req, res) => {
    if (req.file) {
      res.send(`File uploaded successfully! File name: ${req.file.filename}`);
    } else {
      res.status(400).send("No file uploaded.");
    }
  };
};
