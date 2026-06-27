const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error on idle client:", err.message);
});

pool
  .connect()
  .then((client) => {
    client.release();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
