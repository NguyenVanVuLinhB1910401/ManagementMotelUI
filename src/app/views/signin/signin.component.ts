import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router, 
    private toast: NgToastService, 
    private userStote: UserStoreService,
    private resetPasswordService: ResetPasswordService
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      //console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            //console.log(res);
            this.loginForm.reset();
            this.auth.storeAccessToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const userPayload = this.auth.decodedToken();
            this.userStote.setUserNameForStore(userPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
            this.userStote.setRolesForStore(userPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            this.toast.success({detail: "SUCCESS", summary: res.message, duration: 5000});
            this.router.navigate(['dashboard']);
          },
          error: (err) => {
            //console.log(err);
            this.toast.error({detail: "ERROR", summary: err.error.message, duration: 5000});
          }
        })
    }else{
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
  
  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      
      this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: "SUCCESS", summary: "Reset success!", duration: 5000});
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
        },
        error: (err) => {
          this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 5000});
        }
      })
    }
  }
}
