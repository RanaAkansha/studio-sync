const bcrypt = require("bcrypt");
const pool = require("./src/config/db");

async function seed() {
    console.log("Starting database seeding (clean setup with rich demo data)...");

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

        // Insert Clients
        console.log("Inserting client users...");
        const client1Res = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, ["Sample Brand Client", "client@samplebrand.com", clientPasswordHash, "client"]);
        const client1Id = client1Res.rows[0].id;

        const client2Res = await pool.query(`
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, ["Coastal Lodge Client", "client@coastallodge.com", clientPasswordHash, "client"]);
        const client2Id = client2Res.rows[0].id;

        // Insert Projects
        console.log("Inserting projects...");
        
        // Project 1
        const p1Res = await pool.query(`
            INSERT INTO projects (title, description, status, client_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days')
            RETURNING id
        `, [
            "Sample Brand E-Commerce Redesign", 
            "Redesign and modernise the Sample Brand online store. Build custom checkout sections, optimise product page flow, and integrate inventory widget.", 
            "Active", 
            client1Id, 
            adminId
        ]);
        const p1Id = p1Res.rows[0].id;

        // Project 2
        const p2Res = await pool.query(`
            INSERT INTO projects (title, description, status, client_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days')
            RETURNING id
        `, [
            "Sample Brand SEO Optimization", 
            "Perform comprehensive keyword research and on-page SEO optimization for the Sample Brand blog network to increase organic reach.", 
            "Completed", 
            client1Id, 
            adminId
        ]);
        const p2Id = p2Res.rows[0].id;

        // Project 3
        const p3Res = await pool.query(`
            INSERT INTO projects (title, description, status, client_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day')
            RETURNING id
        `, [
            "Coastal Lodge Booking Flow", 
            "Design and implement a responsive lodging reservation widget with visual calendar selection and credit card authorization features.", 
            "In Review", 
            client2Id, 
            adminId
        ]);
        const p3Id = p3Res.rows[0].id;

        // Project 4
        const p4Res = await pool.query(`
            INSERT INTO projects (title, description, status, client_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
            RETURNING id
        `, [
            "Wellness App Brand Strategy", 
            "Formulate visual brand guide, custom typography, color palettes, and social media templates for the wellness mobile application launch.", 
            "Planning", 
            client2Id, 
            adminId
        ]);
        const p4Id = p4Res.rows[0].id;

        // Insert Deliverables
        console.log("Inserting deliverables...");
        
        // Deliverable 1
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '10 days')
        `, [
            p1Id, 
            "E-Commerce Wireframe Layouts", 
            "Initial wireframes for the homepage, product details, and checkout funnel.", 
            "https://docs.google.com/document/d/1a2b3c4d5e6f7g8h9i0j/edit?usp=drive_link", 
            adminId
        ]);

        // Deliverable 2
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '7 days')
        `, [
            p1Id, 
            "Inventory Integration Documentation", 
            "Technical specification and API keys schema for the warehouse inventory connection.", 
            "https://docs.google.com/document/d/2b3c4d5e6f7g8h9i0j1k/edit?usp=drive_link", 
            adminId
        ]);

        // Deliverable 3
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '5 days')
        `, [
            p2Id, 
            "SEO Audit Report", 
            "Detailed on-page SEO findings and target competitor keyword analysis sheets.", 
            "https://docs.google.com/document/d/3c4d5e6f7g8h9i0j1k2l/edit?usp=drive_link", 
            adminId
        ]);

        // Deliverable 4
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '3 days')
        `, [
            p3Id, 
            "Booking Widget API Keys", 
            "Embedded script codes and sandbox environment credentials for the reservation calendar.", 
            "https://docs.google.com/document/d/4d5e6f7g8h9i0j1k2l3m/edit?usp=drive_link", 
            adminId
        ]);

        // Deliverable 5
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '1 day')
        `, [
            p3Id, 
            "Mobile Checkout UI Designs", 
            "Figma layout exports for mobile resolution booking confirmation screens.", 
            "https://docs.google.com/document/d/5e6f7g8h9i0j1k2l3m4n/edit?usp=drive_link", 
            adminId
        ]);

        // Deliverable 6
        await pool.query(`
            INSERT INTO deliverables (project_id, title, description, file_url, uploaded_by, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
        `, [
            p4Id, 
            "Brand Color Palette Guidelines", 
            "Fictional style guidelines outlining core logo usage, typography hierarchy, and web-safe color codes.", 
            "https://docs.google.com/document/d/6f7g8h9i0j1k2l3m4n5o/edit?usp=drive_link", 
            adminId
        ]);

        // Insert Comments
        console.log("Inserting comments...");

        // Project 1 Comments
        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '10 days')
        `, [
            p1Id, 
            client1Id, 
            "Hi Team, the Shopify store homepage layout looks stunning! Could we verify if the checkout button has a clear hover state?"
        ]);

        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '10 days' + INTERVAL '30 minutes')
        `, [
            p1Id, 
            adminId, 
            "Hi there! Yes, we have added a subtle animation and hover state to the primary buttons. You can preview it in the E-Commerce Wireframe Layouts document above."
        ]);

        // Project 2 Comments
        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '5 days')
        `, [
            p2Id, 
            client1Id, 
            "Thanks for sending over the SEO audit report. The recommendation on image optimization is very helpful."
        ]);

        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '5 days' + INTERVAL '2 hours')
        `, [
            p2Id, 
            adminId, 
            "Excellent! We've already compressed all homepage assets, saving about 1.5MB in initial page load weight."
        ]);

        // Project 3 Comments
        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '2 days')
        `, [
            p3Id, 
            client2Id, 
            "Hi Admin, could we review the latest checkout flow layouts? The custom reservation section looks great so far."
        ]);

        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '2 days' + INTERVAL '1 hour')
        `, [
            p3Id, 
            adminId, 
            "Hi there! Yes, let's schedule a call tomorrow morning to go over it. I'll make sure the deliverables link is updated."
        ]);

        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '1 day')
        `, [
            p3Id, 
            client2Id, 
            "Sounds perfect. Let's do 10 AM. I will invite our operations head to the call as well."
        ]);

        // Project 4 Comments
        await pool.query(`
            INSERT INTO comments (project_id, user_id, message, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '4 hours')
        `, [
            p4Id, 
            adminId, 
            "Hello! I have uploaded the draft Brand Guide containing the color palette guidelines. Let me know what you think."
        ]);

        console.log("Database seeded successfully with rich, clean mock accounts and active workspace data!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        pool.end();
    }
}

seed();
