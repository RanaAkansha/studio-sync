const pool = require("../config/db");
const createProject = async (req, res) => {
  try {
    const { title, description, status, client_id } = req.body;

    const adminId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only admin can create projects",
      });
    }

    if (!title || !client_id) {
      return res.status(400).json({
        message: "Title and client_id are required",
      });
    }

    const clientResult = await pool.query(
      `SELECT id,role FROM users WHERE id = $1`,
      [client_id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(400).json({ message: "Client did not exist." });
    }

    if (clientResult.rows[0].role !== "client") {
      return res.status(400).json({ message: "Assigned user is not a client." });
    }

    const newProject = await pool.query(
      `INSERT INTO projects(title, description, status, client_id, created_by)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
      [title, description || null, status || "Planning", client_id, adminId]
    );
    res.status(201).json({
      message: "Project created successfully!",
      project: newProject.rows[0],
    });
  } catch (error) {
    console.error("Create project error", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let projects;

    if (userRole === "admin") {
      projects = await pool.query(
        `SELECT p.*, u.name AS client_name, u.email AS client_email
                FROM projects p
                JOIN users u ON p.client_id = u.id
                ORDER BY p.created_at DESC`
      );
    } else {
      projects = await pool.query(
        `SELECT * FROM projects
                WHERE client_id = $1
                ORDER BY created_at DESC`,
        [userId]
      );
    }

    res.status(200).json({
      message: "Project fetched successfully!",
      projects: projects.rows,
    });
  } catch (error) {
    console.error("Get project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete projects",
      });
    }

    // Safely delete associated comments and deliverables first to prevent foreign key constraint issues
    await pool.query("DELETE FROM comments WHERE project_id = $1", [id]);
    await pool.query("DELETE FROM deliverables WHERE project_id = $1", [id]);
    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};
