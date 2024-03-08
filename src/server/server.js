require("express-async-errors");
const express = require("express");
const httpProxy = require("express-http-proxy");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const authController = require("../controllers/authController");

let server = null;

const start = async () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());

  const options = {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  };
  const moviesServiceProxy = httpProxy(process.env.MOVIES_API, options);
  const catalogServiceProxy = httpProxy(process.env.CATALOG_API, options);

  app.post("/login", authController.login);

  app.use("/movies", moviesServiceProxy);
  app.use(/\/(cities|cinemas)/i, catalogServiceProxy);

  app.listen(process.env.PORT, () => {
    console.log(`API Gateway listening on port ${process.env.PORT}`);
  });
};

const stop = async () => {
  if (server) await server.close();
  return true;
};

module.exports = { start, stop };
