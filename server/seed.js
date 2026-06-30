const bcrypt = require("bcrypt");
const pool = require("./src/config/db");

async function seed() {
    console.log("Starting database seeding (clean setup)...");

    try {
        // Clear all existing data
        console.log("Clearing all tables...");
        await pool.query("TRUNCATE TABLE comments, deliverables, projects, users RESTART IDENTITY CASCADE");

        // Hash passwords
        const saltRounds = 10;
        const adminPasswordHash = await bcrypt.hash("admin123", saltRounds);
        const clientPasswordHash = await bcrypt.hash("client123", saltRounds);

        // Insert Admin
        console.log("Inserting admin user...");
        const adminRes = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, ["Demo Admin", "admin@demoagency.com", adminPasswordHash, "admin"]);
        const adminId = adminRes.rows[0].id;

        // Insert Client
        console.log("Inserting client user...");
        const clientRes = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, ["Sample Brand Client", "client@samplebrand.com", clientPasswordHash, "client"]);
        const clientId = clientRes.rows[0].id;

        // Insert Project
        console.log("Inserting project...");
        const projectRes = await pool.query(`
            INSERT INTO projects (title, description, status, client_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id
        `, [
            "Sample Brand E-Commerce Redesign", 
            "Redesign and modernise the Sample Brand online store. Build custom checkout sections, optimise product page flow, and integrate inventory widget.", 
            "Active", 
            clientId, 
            adminId
        ]);
        const projectId = projectRes.rows[0].id;

        // Insert Deliverable
        console.log("Inserting deliverable...");
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
        `, [
            projectId, 
            "E-Commerce Widget Configuration", 
            "Setup guides and API keys for the inventory widget.", 
            "https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/edit?usp=drive_link", 
            adminId
        ]);

        // Insert Comments
        console.log("Inserting comments...");
        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW())
        `, [
            projectId, 
            clientId, 
            "Hi Admin, could we review the latest checkout flow layouts? The custom section looks great so far."
        ]);

        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')
        `, [
            projectId, 
            adminId, 
            "Hi there! Yes, let's schedule a call tomorrow morning to go over it. I'll make sure the deliverables link is updated."
        ]);

        console.log("Database seeded successfully with clean accounts and mock data!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        pool.end();
    }
}

seed();
