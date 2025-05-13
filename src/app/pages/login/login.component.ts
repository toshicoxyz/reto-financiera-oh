import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

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
  loginForm: UntypedFormGroup;
  mode: 'signIn' | 'signUp' = 'signIn';
  telonState: 'full' | 'compact' = 'full';
  successMessage: string = '';

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snack-error'] : ['snack-success'],
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

    try {
      if (this.mode === 'signIn') {
        const success = this.authService.login(email, password);
        if (!success) {
          this.loginForm.get('email')?.setErrors({ incorrect: true });
          this.loginForm.get('password')?.setErrors({ incorrect: true });
          this.showMessage('Correo o contraseña incorrectos', true);
          return;
        }

        this.showMessage('Inicio de sesión exitoso');
        this.telonState = 'compact';
        setTimeout(() => this.router.navigate(['/home']), 600);
      } else {
        const success = this.authService.register(email, password);
        if (!success) {
          this.loginForm.get('email')?.setErrors({ taken: true });
          this.showMessage('El correo ya está registrado', true);
          return;
        }

        this.showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => {
          this.setMode('signIn');
          this.loginForm.reset();
        }, 2500);
      }
    } catch (error) {
      console.error(error);
      this.showMessage('Ocurrió un error inesperado', true);
    }
  }
}
