const database = require("../config/database");
const bcrypt = require("bcryptjs");

const getUser = async (email, password) => {
  const db = await database.connect();
  const user = await db.collection("users").findOne({ email });

  if (!user) throw new Error("Wrong email or password");

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) throw new Error("Wrong email or password");

  return user;
};

module.exports = { getUser };
