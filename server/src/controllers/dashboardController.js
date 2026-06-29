const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let totalProjects, totalClients, totalDeliverables, totalComments;
    let recentProjects, recentDeliverables, recentComments;

    if (userRole === "admin") {
      // Admin sees counts for the entire agency workspace
      totalProjects = await pool.query("SELECT COUNT(*) FROM projects");
      totalClients = await pool.query("SELECT COUNT(*) FROM users WHERE role='client'");
      totalDeliverables = await pool.query("SELECT COUNT(*) FROM deliverables");
      totalComments = await pool.query("SELECT COUNT(*) FROM comments");

      recentProjects = await pool.query(
        `SELECT
            projects.id,
            projects.title,
            users.name AS client_name,
            projects.status
         FROM projects
         JOIN users ON projects.client_id = users.id
         ORDER BY projects.created_at DESC
         LIMIT 5`
      );

      recentDeliverables = await pool.query(
        `SELECT
            d.id,
            d.title,
            d.file_url,
            d.uploaded_at,
            p.title AS project_title,
            u.name AS uploaded_by_name
         FROM deliverables d
         JOIN projects p ON d.project_id = p.id
         JOIN users u ON d.uploaded_by = u.id
         ORDER BY d.uploaded_at DESC
         LIMIT 5`
      );

      recentComments = await pool.query(
        `SELECT
            c.id,
            c.message,
            c.created_at,
            p.title AS project_title,
            u.name AS user_name
         FROM comments c
         JOIN projects p ON c.project_id = p.id
         JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at DESC
         LIMIT 5`
      );
    } else {
      // Client only sees stats and objects belonging to their own projects
      totalProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE client_id = $1", [userId]);
      totalClients = { rows: [{ count: 0 }] }; // Not shown to client on UI anyway
      totalDeliverables = await pool.query(
        "SELECT COUNT(*) FROM deliverables d JOIN projects p ON d.project_id = p.id WHERE p.client_id = $1",
        [userId]
      );
      totalComments = await pool.query(
        "SELECT COUNT(*) FROM comments c JOIN projects p ON c.project_id = p.id WHERE p.client_id = $1",
        [userId]
      );

      recentProjects = await pool.query(
        `SELECT
            projects.id,
            projects.title,
            users.name AS client_name,
            projects.status
         FROM projects
         JOIN users ON projects.client_id = users.id
         WHERE projects.client_id = $1
         ORDER BY projects.created_at DESC
         LIMIT 5`,
        [userId]
      );

      recentDeliverables = await pool.query(
        `SELECT
            d.id,
            d.title,
            d.file_url,
            d.uploaded_at,
            p.title AS project_title,
            u.name AS uploaded_by_name
         FROM deliverables d
         JOIN projects p ON d.project_id = p.id
         JOIN users u ON d.uploaded_by = u.id
         WHERE p.client_id = $1
         ORDER BY d.uploaded_at DESC
         LIMIT 5`,
        [userId]
      );

      recentComments = await pool.query(
        `SELECT
            c.id,
            c.message,
            c.created_at,
            p.title AS project_title,
            u.name AS user_name
         FROM comments c
         JOIN projects p ON c.project_id = p.id
         JOIN users u ON c.user_id = u.id
         WHERE p.client_id = $1
         ORDER BY c.created_at DESC
         LIMIT 5`,
        [userId]
      );
    }

    res.json({
      stats: {
        projects: Number(totalProjects.rows[0].count),
        clients: Number(totalClients.rows[0].count),
        deliverables: Number(totalDeliverables.rows[0].count),
        comments: Number(totalComments.rows[0].count),
      },
      recentProjects: recentProjects.rows,
      recentDeliverables: recentDeliverables.rows,
      recentComments: recentComments.rows,
    });

  } catch (error) {
    console.error("Dashboard data load error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getDashboard };