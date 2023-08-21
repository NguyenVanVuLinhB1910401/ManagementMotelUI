import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
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
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService) {}
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      userName: ['', Validators.required], 
      password: ['', Validators.required]
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
      this.auth.signUp(this.signUpForm.value)
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
}
