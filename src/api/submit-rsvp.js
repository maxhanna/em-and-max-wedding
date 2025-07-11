const { Pool } = require('pg');

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: true,
            }
        });

        const {
            firstName,
            lastName,
            email,
            attending,
            guestCount,
            dietaryRestrictions,
            songRequest,
            message
        } = req.body;

        // Execute query directly using pg
        const result = await pool.query(
            `INSERT INTO rsvps (
                first_name,
                last_name,
                email,
                attending,
                guest_count,
                dietary_restrictions,
                song_request,
                message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
            [
                firstName,
                lastName,
                email,
                attending,
                guestCount || null,
                dietaryRestrictions || null,
                songRequest || null,
                message || null
            ]
        );

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({
            success: true,
            id: result.rows[0].id
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            error: 'Failed to process RSVP',
            details: error.message
        });
    }
}