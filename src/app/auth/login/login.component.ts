import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PinServiceService } from '../../service/pin-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    phoneNumber = '';
  isLoading = false;

  // Default values - can be configured or retrieved from URL params
  private readonly service = '5';
  private readonly pubId = '1';

  private pinService = inject(PinServiceService);
  private router = inject(Router);
  snackBar = inject(MatSnackBar);

  private generateClickId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    // Use crypto.getRandomValues for better randomness if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      for (let i = 0; i < 32; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback to Math.random if crypto is not available
      for (let i = 0; i < 32; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return result;
  }


  onSubmit(): void {
    console.log('onSubmit', this.phoneNumber);
    // if (!this.phoneNumber || this.phoneNumber.trim() === '') {
    //   alert('Please enter a phone number');
    //   return;
    // }

    // // Remove any non-numeric characters from phone number
    const msisdn = parseInt(this.phoneNumber.replace(/\D/g, ''), 10);

    // if (isNaN(msisdn) || msisdn.toString().length < 10) {
    //   alert('Please enter a valid phone number');
    //   return;
    // }

    this.isLoading = true;

    // Generate unique 32-character click_id
    const clickId = this.generateClickId();

    this.pinService
      .generatePin({
        msisdn: msisdn.toString(),
        service: this.service,
        pub_id: this.pubId,
        click_id: clickId,
      })
      .subscribe({
        next: (response:any) => {
          console.log(response)
          this.isLoading = false;
          if(response.status == 'success'){
        
          console.log('PIN generation successful:', response);
          this.router.navigate(['/otp'], {
            state: {
              msisdn: msisdn.toString(),
              service: this.service,
              pubId: this.pubId,
              clickId: clickId,
            },
          });
        }else{
        //  alert(response.message);
           this.showSnackbar(response.message)
        }
          // Handle success - you might want to navigate to OTP page or show success message
        },
        error: (error) => {
          this.isLoading = false;
          console.error('PIN generation failed:', error);
          this.showSnackbar(error.error.message)
         // alert('Failed to generate PIN. Please try again.');
        },
      });
  }

      showSnackbar(message:any) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,       // auto hide after 3 sec
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
