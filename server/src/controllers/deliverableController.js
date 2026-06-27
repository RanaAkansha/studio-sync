const pool = require("../config/db");

// Upload Deliverable
const uploadDeliverable = async (req, res) => {
  try {
    const { project_id, title, description, file_url } = req.body;

    const uploadedBy = req.user.id;

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

// Get Deliverables of a Project
const getDeliverables = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM deliverables
       WHERE project_id=$1
       ORDER BY uploaded_at DESC`,
      [projectId]
    );

    res.status(200).json({
      deliverables: result.rows,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  uploadDeliverable,
  getDeliverables,
};