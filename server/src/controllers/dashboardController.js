const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {

    const totalProjects = await pool.query(
      "SELECT COUNT(*) FROM projects"
    );

    const totalClients = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role='client'"
    );

    const totalDeliverables = await pool.query(
      "SELECT COUNT(*) FROM deliverables"
    );

    const totalComments = await pool.query(
      "SELECT COUNT(*) FROM comments"
    );

    const recentProjects = await pool.query(
      `SELECT
          projects.id,
          projects.title,
          users.name AS client_name,
          projects.status
       FROM projects
       JOIN users
       ON projects.client_id = users.id
       ORDER BY projects.created_at DESC
       LIMIT 5`
    );

    res.json({
      stats: {
        projects: Number(totalProjects.rows[0].count),
        clients: Number(totalClients.rows[0].count),
        deliverables: Number(totalDeliverables.rows[0].count),
        comments: Number(totalComments.rows[0].count),
      },

      recentProjects: recentProjects.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  getDashboard,
};