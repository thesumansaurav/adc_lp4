import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements AfterViewInit {
  @Output() otpChange = new EventEmitter<string>();
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  boxes = Array(6).fill('');
  otp: string[] = Array(6).fill('');

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

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const data = event.clipboardData?.getData('text') || '';
    const digits = data.replace(/\D/g, '').slice(0, this.boxes.length).split('');

    digits.forEach((digit, i) => {
      const input = this.otpInputs.toArray()[i].nativeElement;
      input.value = digit;
      this.otp[i] = digit;
    });

    this.emitOtp();
  }

  private emitOtp(): void {
    const otpValue = this.otp.join('');
    this.otpChange.emit(otpValue);
  }
}
