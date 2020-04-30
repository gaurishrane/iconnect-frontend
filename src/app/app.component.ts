import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  /** Show component */
  showLogin: boolean = true;
  showSignup: boolean = false;
  showDashboard: boolean = false;

  baseUrl: string = 'http://localhost:5555/iconnect-server/';

  title = 'iconnect-frontend';
  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(public fb: FormBuilder, public http: HttpClient) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });

    this.signUpForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      mobile: this.fb.control('', [Validators.required]),
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });

  }

  goBackLogin() {
    this.showSignup = false;
    this.showLogin = true;
  }

  goToSignUp() {
    this.showSignup = true;
    this.showLogin = false;
  }

  loginSubmit(event) {
    if (this.loginForm.valid) {
      console.log('logins', this.loginForm.value);
      this.http.post(this.baseUrl + 'users/login', this.loginForm.value, {})
        .subscribe((data: any) => {
          if (data.status) {
            alert(data.message);
            this.showLogin = this.showSignup = false;
            this.showDashboard = true;
          } else {
            alert(data.reason);
          }
        }, (error: any) => {
          console.error('error =>', error);
        });
    } else {
      alert('Please enter required details.');
    }
  }

  signUpSubmit(event) {
    if (this.signUpForm.valid) {
      console.log('logins', this.signUpForm.value);

      this.http.post(this.baseUrl + 'users/registration', this.signUpForm.value, {})
        .subscribe((data: any) => {
          if (data.status) {
            alert(data.message);
          } else {
            alert(data.reason);
          }
        }, (error: any) => {
          console.error('error =>', error);
        });

    } else {
      alert('Please enter required details.');
    }
  }

  logout() {
    this.showDashboard = this.showLogin = false;
    this.showLogin = true;
  }
}
