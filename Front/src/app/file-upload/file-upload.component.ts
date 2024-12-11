import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  predictionResult: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private readonly apiUrl: string = 'http://127.0.0.1:5000/predict';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'audio/wav') {
      this.selectedFile = file;
      this.errorMessage = '';
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Invalid file type. Please upload a .wav file.';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first!';
      return;
    }

    this.isLoading = true; // Set loading state
    this.predictionResult = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ genre: string }>(this.apiUrl, formData)
      .subscribe({
        next: (response) => {
          this.predictionResult = `Predicted genre: ${response.genre}`;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error: ${error.message}`;
          this.isLoading = false;
        }
      });
  }
}
