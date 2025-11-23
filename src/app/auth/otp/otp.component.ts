import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PinServiceService } from '../../service/pin-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatSnackBarModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements AfterViewInit {
  @Output() otpChange = new EventEmitter<string>();

  otpArray: string[] = new Array(5).fill('');
  isLoading = false;
  
  // Data from login component
  private msisdn = '';
  private service = '';
  private pubId = '';
  private clickId = '';

  private pinService = inject(PinServiceService);
  private router = inject(Router);
  snackBar = inject(MatSnackBar);
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  otp: string[] = Array(5).fill('');
  otpmodel:any = ''

  ngOnInit(): void {
    // Get data from route state (passed from login component)
    const navigation = this.router.getCurrentNavigation();
    let state: {
      msisdn?: string;
      service?: string;
      pubId?: string;
      clickId?: string;
    } | null = null;

    if (navigation?.extras?.state) {
      state = navigation.extras.state as {
        msisdn: string;
        service: string;
        pubId: string;
        clickId: string;
      };
    } else if (history.state) {
      // Fallback to history.state if navigation state is not available
      state = history.state as {
        msisdn?: string;
        service?: string;
        pubId?: string;
        clickId?: string;
      };
    }

    if (state) {
      this.msisdn = state.msisdn || '';
      this.service = state.service || '';
      this.pubId = state.pubId || '';
      this.clickId = state.clickId || '';
    }
  }

  ngAfterViewInit(): void {
    // Focus the first field
    setTimeout(() => this.otpInputs.first.nativeElement.focus(), 0);
  }

  handleInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // digits only

    if (value.length > 1) value = value.slice(-1); // keep last digit
    input.value = value;
    this.otp[index] = value;

    // Move to next box
    if (value && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    this.emitOtp();
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
        prevInput.focus();
      } else {
        this.otp[index] = '';
      }
      this.emitOtp();
    }
  }

  // handlePaste(event: ClipboardEvent): void {
  //   event.preventDefault();
  //   const data = event.clipboardData?.getData('text') || '';
  //   const digits = data.replace(/\D/g, '').slice(0, this.boxes.length).split('');

  //   digits.forEach((digit, i) => {
  //     const input = this.otpInputs.toArray()[i].nativeElement;
  //     input.value = digit;
  //     this.otp[i] = digit;
  //   });

  //   this.emitOtp();
  // }

  private emitOtp(): void {
    const otpValue = this.otp.join('');
    this.otpChange.emit(otpValue);
  }

    onVerify(): void {
 //   const pin = this.otp.join('');

    // if (pin.length !== 5) {
    //   alert('Please enter a complete 5-digit OTP');
    //   return;
    // }

    if (!this.msisdn || !this.service || !this.pubId || !this.clickId) {
      alert('Missing verification data. Please try logging in again.');
      return;
    }

    this.isLoading = true;

    this.pinService
      .verifyPin({
        msisdn: this.msisdn,
        service: this.service,
        pub_id: this.pubId,
        click_id: this.clickId,
        pin: this.otpmodel//pin,
      })
      .subscribe({
        next: (response:any) => {
          this.isLoading = false;
          console.log('PIN verification successful:', response);
          // Handle success - you might want to navigate to success page or dashboard
         // alert('OTP verified successfully!');
          this.showSnackbar('OTP verified successfully!')
        },
        error: (error:any) => {
          this.isLoading = false;
          console.error('PIN verification failed:', error.error.message);
          this.showSnackbar(error.error.message)
        //  alert('Invalid OTP. Please try again.');
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
