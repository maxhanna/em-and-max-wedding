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

        // Use Neon HTTP API
        const response = await fetch(process.env.DATABASE_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STACK_SECRET_SERVER_KEY}`,
                'Neon-Project-Id': process.env.STACK_PROJECT_ID
            },
            body: JSON.stringify({
                query: `
            INSERT INTO rsvps (
              first_name,
              last_name,
              email,
              attending,
              guest_count,
              dietary_restrictions,
              song_request,
              message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
                params: [
                    firstName,
                    lastName,
                    email,
                    attending,
                    guestCount || null,
                    dietaryRestrictions || null,
                    songRequest || null,
                    message || null
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit RSVP via Neon API');
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Neon API error:', error);
        return res.status(500).json({
            error: 'Failed to process RSVP',
            details: error.message
        });
    }
  }