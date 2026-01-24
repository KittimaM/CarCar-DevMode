const testPathGet = (req, res, next) => {
  const { name } = req.body;
  return res.json({ status: "SUCCESS", msg: `testpath : ${name}` });
};

module.exports = {
  testPathGet,
};
