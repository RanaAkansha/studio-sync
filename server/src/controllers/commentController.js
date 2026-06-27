const pool = require("../config/db");

// Add Comment
const addComment = async (req, res) => {
  try {
    const { project_id, message } = req.body;

    const userId = req.user.id;

    if (!project_id || !message) {
      return res.status(400).json({
        message: "Project and message are required.",
      });
    }

    const project = await pool.query(
      "SELECT * FROM projects WHERE id=$1",
      [project_id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const result = await pool.query(
      `INSERT INTO comments
      (project_id,user_id,message)
      VALUES($1,$2,$3)
      RETURNING *`,
      [project_id, userId, message]
    );

    res.status(201).json({
      message: "Comment added successfully.",
      comment: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// Get Comments
const getComments = async (req, res) => {
  try {

    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT comments.*, users.name
       FROM comments
       JOIN users
       ON comments.user_id = users.id
       WHERE project_id=$1
       ORDER BY created_at ASC`,
      [projectId]
    );

    res.status(200).json({
      comments: result.rows,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  addComment,
  getComments,
};