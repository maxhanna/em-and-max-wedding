import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RsvpService {
    constructor() { }

    async submitRsvp(rsvpData: any): Promise<{ success: boolean, message?: string }> {
        try {
            const response = await fetch('/api/submit-rsvp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rsvpData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || 'Failed to submit RSVP');
            }

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Failed to submit RSVP'
            };
        }
    }
}