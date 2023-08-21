import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './views/signin/signin.component';
import { SignupComponent } from './views/signup/signup.component';
import { HomeComponent } from './views/home/home.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';

const routes: Routes = [
  { path: "login", component: SigninComponent },
  { path: "signup", component: SignupComponent },
  { path: "dashboard", component: HomeComponent},
  { path: "reset", component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
