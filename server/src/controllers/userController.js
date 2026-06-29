const pool = require("../config/db");

const getClients = async (req, res) => {
  try {
    const clients = await pool.query(
      `
      SELECT id, name
      FROM users
      WHERE role = 'client'
      ORDER BY name
      `
    );

    res.status(200).json({
      clients: clients.rows,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getClients,
};