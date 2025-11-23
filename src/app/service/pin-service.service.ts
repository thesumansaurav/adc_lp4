import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PinGenerationRequest {
  msisdn: string;
  service: string;
  pub_id: string;
  click_id: string;
}

export interface PinGenerationResponse {
  // Add response interface based on API response structure
  [key: string]: unknown;
}

export interface PinVerificationRequest {
  msisdn: string | number;
  service: string;
  pub_id: string;
  click_id: string;
  pin: string;
}

export interface PinVerificationResponse {
  // Add response interface based on API response structure
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class PinServiceService {
  private readonly pinGenerationUrl = `${environment.apiBaseUrl}/publisher/pin-generation/`;
  private readonly pinVerificationUrl = `${environment.apiBaseUrl}/publisher/pin-verification/`;
  private http = inject(HttpClient);

  generatePin(request: PinGenerationRequest): Observable<PinGenerationResponse> {
    return this.http.post<PinGenerationResponse>(this.pinGenerationUrl, request);
  }

  verifyPin(request: PinVerificationRequest): Observable<PinVerificationResponse> {
    return this.http.post<PinVerificationResponse>(this.pinVerificationUrl, request);
  }
}
