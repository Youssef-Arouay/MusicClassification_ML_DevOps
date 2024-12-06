import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadVGG19Component } from './file-upload-vgg19.component';

describe('FileUploadVGG19Component', () => {
  let component: FileUploadVGG19Component;
  let fixture: ComponentFixture<FileUploadVGG19Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadVGG19Component]
    });
    fixture = TestBed.createComponent(FileUploadVGG19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
