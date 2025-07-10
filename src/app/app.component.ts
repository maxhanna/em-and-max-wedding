import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent {
  rsvpForm: FormGroup;
  submitted = false;
  isLoading = false;
  responseMessage = '';

  // Placeholder for database service (to be implemented later)
  // private rsvpService: RsvpService

  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    this.submitted = true;

    if (this.rsvpForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Placeholder for database submission
    // this.rsvpService.submitRsvp(this.rsvpForm.value).subscribe(
    //   response => {
    //     this.isLoading = false;
    //     this.responseMessage = 'Thank you for your RSVP! We look forward to celebrating with you.';
    //     this.rsvpForm.reset();
    //     this.submitted = false;
    //   },
    //   error => {
    //     this.isLoading = false;
    //     this.responseMessage = 'There was an error submitting your RSVP. Please try again later.';
    //   }
    // );

    // Simulating API call timeout
    setTimeout(() => {
      this.isLoading = false;
      this.responseMessage = 'Thank you for your RSVP! We look forward to celebrating with you.';
      this.rsvpForm.reset();
      this.submitted = false;
    }, 1500);
  }

  get f() { return this.rsvpForm.controls; }
}