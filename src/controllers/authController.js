const jwt = require("jsonwebtoken");
const repository = require("../repository/repository");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await repository.getUser(email, password);

    const token = jwt.sign(
      { userId: user._id, profileId: user.profileId },
      process.env.JWT_SECRET,
      {
        expiresIn: parseInt(process.env.JWT_EXPIRATION),
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const validateToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) res.status(401).json({ message: "Unauthorized" });

  token = token.replace("Bearer ", "");

  try {
    const { userId, profileId } = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.userId = userId;
    res.locals.profileId = profileId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { login, validateToken };
