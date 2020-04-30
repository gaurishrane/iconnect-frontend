import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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

  loadingStatus: boolean = false;
  loadingData: boolean = false;

  baseUrl: string = 'http://localhost:5555/iconnect-server/';

  title = 'iconnect-frontend';
  loginForm: FormGroup;
  signUpForm: FormGroup;

  token: string = '';
  userDetails: any[] = [];

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
      this.loadingStatus = true;
      this.http.post(this.baseUrl + 'users/login', this.loginForm.value, {})
        .subscribe((data: any) => {
          this.loadingStatus = false;
          if (data.status) {
            this.token = data.token;
            this.showLogin = this.showSignup = false;
            this.showDashboard = true;
            this.getUserDetails();
            this.loginForm.reset();
            alert(data.message);
          } else {
            alert(data.reason);
          }
        }, (error: any) => {
          this.loadingStatus = false;
          console.error('error =>', error);
        });
    } else {
      alert('Please enter required details.');
    }
  }

  signUpSubmit(event) {
    if (this.signUpForm.valid) {

      this.loadingStatus = true;

      this.http.post(this.baseUrl + 'users/registration', this.signUpForm.value, {})
        .subscribe((data: any) => {
          this.loadingStatus = false;
          if (data.status) {
            this.signUpForm.reset();
            this.showDashboard = this.showSignup = false;
            this.showLogin = true;

            alert(data.message);
          } else {
            alert(data.reason);
          }
        }, (error: any) => {
          this.loadingStatus = false;
          console.error('error =>', error);
        });

    } else {
      alert('Please enter required details.');
    }
  }

  getUserDetails() {

    this.loadingData = true;
    this.http.get(this.baseUrl + 'users/userDetails', {
      headers: {
        'authorization': 'Bearer ' + this.token
      }
    }).subscribe((data: any) => {
      this.loadingData = false;
      if (data.status) {
        this.userDetails = data.data;
      } else {
        alert('Oops can not get your data.');
      }
    }, (error: any) => {
      this.loadingData = false;
    });
  }

  logout() {
    this.showDashboard = this.showLogin = false;
    this.showLogin = true;
  }
}
