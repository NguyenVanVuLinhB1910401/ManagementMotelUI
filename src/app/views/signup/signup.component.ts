import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;
  imagePreviousCCCD: any;
  imageAfterCCCD: any;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService) {}
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      userName: ['', Validators.required], 
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      cccd: ['', [Validators.required, Validators.maxLength(12)]],
      address: ['', Validators.required],
      mobilePhone: ['', [Validators.required, Validators.maxLength(12)]],
      imagePreviousCCCD: [null, Validators.required],
      imageAfterCCCD: [null, Validators.required]
    },{
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    })
  }
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  onSignUp(){
    if(this.signUpForm.valid){
      //console.log(this.signUpForm.value);
      const formData = new FormData();
      // formData.append('imagePreviousCCCD', this.signUpForm.get('imagePreviousCCCD')!.value.files[0]);
      // formData.append('imageAfterCCCD', this.signUpForm.get('imageAfterCCCD')!.value.files[0]);
      for (const key in this.signUpForm.value) {
        if (this.signUpForm.value.hasOwnProperty(key)) {
          formData.append(key, this.signUpForm.value[key]);
          //console.log(key+ ":" + this.signUpForm.value[key]); 
        }
      }
      formData.append("imagePreviousCCCD", this.imagePreviousCCCD);
      formData.append("imageAfterCCCD", this.imageAfterCCCD);
      this.auth.signUp(formData)
        .subscribe({
          next: (res) => {
            this.signUpForm.reset();
            this.toast.success({detail: "SUCCESS", summary: res.message, duration: 5000});
            this.router.navigate(['login']);
          },
          error: (err) => {
            this.toast.error({detail: "ERROR", summary: err?.error.message, duration: 5000});
          }
        })
    }else{
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

  getImagePreviousCCCD(event: any){
    this.imagePreviousCCCD = event.target.files[0];
  }
  getImageAfterCCCD(event: any){
    this.imageAfterCCCD = event.target.files[0];
  }
}
