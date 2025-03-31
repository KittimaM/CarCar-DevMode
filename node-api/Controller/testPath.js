const testPathGet = (req, res, next) => {
  const { name } = req.body;
  res.json({ status: "SUCCESS", msg: `testpath : ${name}` });
};

module.exports = {
  testPathGet,
};
