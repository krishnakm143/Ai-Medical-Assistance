import { NgFor, NgIf } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from "@angular/forms"
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Auth, signInWithPopup, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase.config'; // Adjust the path as necessary

@Component({
  selector: 'app-auth',
  standalone: true, 
  imports: [NgIf, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-in')  
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLogin = true;
  loading = false;
  progress = 0;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authForm = this.fb.group({
      name: [""],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Get the return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.authForm.get("name")?.clearValidators();
    } else {
      this.authForm.get("name")?.setValidators([Validators.required]);
    }
    this.authForm.get("name")?.updateValueAndValidity();
  }

   async onSubmit() {
    if (this.authForm.valid) {
      this.loading = true;
      this.progress = 20;

      const { email, password } = this.authForm.value;

      try {
        if (this.isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          alert("Login successful!");
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          alert("Registration successful!");
        }
        this.router.navigateByUrl(this.returnUrl);
      } catch (error: any) {
        alert(error.message);
      }

      this.loading = false;
      this.progress = 100;
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Login successful!");
      this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async loginWithApple() {
    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, provider);
      alert("Login successful!");
      this.router.navigateByUrl(this.returnUrl);
    } catch (error: any) {
      alert(error.message);
    }
  }
}