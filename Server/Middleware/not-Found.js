const notFound = (error, req, res, next) => {
  res.status(404).json({ message: "Requested route does not exist" });
};

module.exports = notFound;