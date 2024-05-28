import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { RegisterRequest } from '../interfaces/RegisterRequest';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private subscription: Subscription | undefined;

formControls: { [key: string]: FormControl } = {
  username: new FormControl('', [Validators.required, Validators.minLength(2)]),
  email: new FormControl('', [Validators.email, Validators.required]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$')
  ]),
};

controlNames: { [key: string]: string } = {
  username: 'Le nom d\'utilisateur doit avoir au moins 2 caractères',
  email: 'L\'adresse mail doit avoir un format valide',
  password: 'Le mot de passe avec au moins 8 caractères, dont 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial',
};

errorMessages: { [key: string]: string } = {
  username: '',
  email: '',
  password: '',
};

  constructor(
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit(): void {}


  onBlur(controlName: string): void {
    const control = this.formControls[controlName];
    control.markAsTouched();
    if (control.hasError('required')) {
      this.errorMessages[controlName] = `Veuillez saisir ${this.controlNames[controlName]}`;
    } else if (control.hasError('pattern')) {
      this.errorMessages[controlName] = 'Le mot de passe ne réponds pas aux exigences';
    } else {
      this.errorMessages[controlName] = '';
    }
  }

  onSubmit(): void {
    console.log("register")
    if (this.formControls["username"].valid && this.formControls['email'].valid && this.formControls['password'].valid) {
      const registerRequest: RegisterRequest = {
        username: this.formControls['username'].value,
        email: this.formControls['email'].value,
        password: this.formControls['password'].value,
      };
      
      this.subscription = this.authService.register(registerRequest).subscribe({
        next: () => {
          this.router.navigate(['/home']); // Redirection après succès de l'inscription
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
          this.errorMessages['username'] = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      });
    }}

    ngOnDestroy(): void {
      if (this.subscription) {
      this.subscription.unsubscribe();
  }
  }

}


