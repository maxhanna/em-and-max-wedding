import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RsvpService {
    constructor() { }

    private createAuthHeader(): string {
        const token = `${environment.neonProjectId}:${environment.neonApiKey}`;
        return `Bearer ${btoa(token)}`;
    }

    async submitRsvp(rsvpData: any): Promise<{ success: boolean, message?: string }> {
        try {
            const query = {
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
            };

            const response = await fetch(environment.neonEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.createAuthHeader()
                },
                body: JSON.stringify(query)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to submit RSVP');
            }

            return { success: true };
        } catch (error: any) {
            console.error('RSVP Error:', error);
            return {
                success: false,
                message: error.message || 'Failed to submit RSVP'
            };
        }
    }
}