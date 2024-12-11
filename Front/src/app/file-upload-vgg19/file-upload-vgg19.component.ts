import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-file-upload-vgg19',
  templateUrl: './file-upload-vgg19.component.html',
  styleUrls: ['./file-upload-vgg19.component.css']
})
export class FileUploadVGG19Component {
  selectedFile: File | null = null;
  predictionResult: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first!';
      this.predictionResult = '';  // Clear the prediction result
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Send the file to the backend API
    this.http.post<{ genre: string }>('http://127.0.0.1:5000/predict', formData)
      .subscribe({
        next: (response) => {
          this.predictionResult = `Predicted genre: ${response.genre}`;
          this.errorMessage = '';  // Clear any previous error
        },
        error: (error: HttpErrorResponse) => {
          // Improved error message handling
          if (error.status === 0) {
            this.errorMessage = 'Server not reachable. Please check your backend server.';
          } else {
            this.errorMessage = `Error: ${error.message}`;
          }
          this.predictionResult = '';  // Clear the prediction result
        }
      });
  }
}
