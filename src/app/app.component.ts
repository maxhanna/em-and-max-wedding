import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RsvpService } from './rsvp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rsvpForm: FormGroup;
  submitted = false;
  isLoading = false;
  responseMessage = '';

  constructor(
    private fb: FormBuilder,
    private rsvpService: RsvpService
  ) {
    this.rsvpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      attending: ['', Validators.required],
      guestCount: [1, [Validators.min(1), Validators.max(4)]],
      dietaryRestrictions: [''],
      songRequest: [''],
      message: ['']
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.rsvpForm.invalid) return;

    this.isLoading = true;

    const result = await this.rsvpService.submitRsvp(this.rsvpForm.value);

    this.isLoading = false;

    if (result.success) {
      this.responseMessage = 'Thank you for your RSVP! We look forward to celebrating with you.';
      this.rsvpForm.reset({
        guestCount: 1
      });
      this.submitted = false;
    } else {
      this.responseMessage = result.message || 'There was an error submitting your RSVP. Please try again later.';
    }
  }

  get f() { return this.rsvpForm.controls; }
}