const server = require("./server/server");

(async () => {
  try {
    await server.start();
  } catch (error) {
    console.error(error);
  }
})();
 