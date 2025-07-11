import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

interface RsvpData {
    firstName: string;
    lastName: string;
    email: string;
    attending: string;
    guestCount?: number;
    dietaryRestrictions?: string;
    songRequest?: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RsvpService {
    private readonly neonDbUrl = environment.neonDbUrl;

    constructor() { }

    async submitRsvp(rsvpData: RsvpData): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await fetch(this.neonDbUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Neon-Connection-String': environment.neonConnectionString
                },
                body: JSON.stringify({
                    query: `
            INSERT INTO rsvps (
              first_name, last_name, email, attending, 
              guest_count, dietary_restrictions, song_request, message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
                    params: [
                        rsvpData.firstName,
                        rsvpData.lastName,
                        rsvpData.email,
                        rsvpData.attending,
                        rsvpData.guestCount || null,
                        rsvpData.dietaryRestrictions || null,
                        rsvpData.songRequest || null,
                        rsvpData.message || null
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit RSVP');
            }

            return { success: true };
        } catch (error: any) {
            console.error('RSVP submission error:', error);
            return { success: false, message: error.message };
        }
    }
}