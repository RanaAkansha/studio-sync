const pool = require("../config/db");

// Upload Deliverable
const uploadDeliverable = async (req, res) => {
  try {
    const { project_id, title, description, file_url } = req.body;

    const uploadedBy = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only agency admins can upload deliverables.",
      });
    }

    if (!project_id || !title || !file_url) {
      return res.status(400).json({
        message: "Project, title and file URL are required.",
      });
    }

    const project = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [project_id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const result = await pool.query(
      `INSERT INTO deliverables
      (project_id,title,description,file_url,uploaded_by)
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        project_id,
        title,
        description,
        file_url,
        uploadedBy,
      ]
    );

    res.status(201).json({
      message: "Deliverable uploaded successfully.",
      deliverable: result.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getDeliverables = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let result;

    if (role === "admin") {
      result = await pool.query(
        `
        SELECT
          d.*,
          p.title AS project_title,
          u.name AS uploaded_by_name
        FROM deliverables d
        JOIN projects p ON d.project_id = p.id
        JOIN users u ON d.uploaded_by = u.id
        ORDER BY d.uploaded_at DESC
        `
      );
    } else {
      result = await pool.query(
        `
        SELECT
          d.*,
          p.title AS project_title,
          u.name AS uploaded_by_name
        FROM deliverables d
        JOIN projects p ON d.project_id = p.id
        JOIN users u ON d.uploaded_by = u.id
        WHERE p.client_id = $1
        ORDER BY d.uploaded_at DESC
        `,
        [userId]
      );
    }

    res.json({
      deliverables: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteDeliverable = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete deliverables",
      });
    }

    const result = await pool.query("DELETE FROM deliverables WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Deliverable not found" });
    }

    res.status(200).json({
      message: "Deliverable deleted successfully",
    });
  } catch (error) {
    console.error("Delete deliverable error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadDeliverable,
  getDeliverables,
  deleteDeliverable,
};
