import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('telonAnimation', [
      state('full', style({ height: '100vh' })),
      state('compact', style({ height: '60px' })),
      transition('full <=> compact', [animate('600ms ease-in-out')]),
    ]),
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  mode: 'signIn' | 'signUp' = 'signIn';
  telonState: 'full' | 'compact' = 'full';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  setMode(mode: 'signIn' | 'signUp') {
    this.mode = mode;
  }

  getError(control: string): string {
    const ctrl = this.loginForm.get(control);
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required']) return `Completa el campo ${control}`;
    if (ctrl.errors['email']) return 'Correo electrónico inválido';
    if (ctrl.errors['minlength'])
      return `Contraseña - ${ctrl.errors['minlength'].requiredLength} caracteres`;
    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log('Form submitted:', this.loginForm.value);
    console.log('Form mode:', this.mode);

    if (this.mode === 'signIn') {
      const success = this.authService.login(email, password);
      if (!success) {
        this.loginForm.get('email')?.setErrors({ incorrect: true });
        this.loginForm.get('password')?.setErrors({ incorrect: true });
        return;
      }
    } else {
      const success = this.authService.register(email, password);
      if (!success) {
        this.loginForm.get('email')?.setErrors({ taken: true });
        return;
      }
    }

    // Simula el telón levantándose antes de redirigir
    this.telonState = 'compact';
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 600);
  }
}
