import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      const success = this.authService.register(email, password);

      if (!success) {
        alert('Este email ya está registrado. Serás redirigido al login.');
        this.router.navigate(['/login']);
      } else {
        alert('Cuenta creada con éxito. Redirigiendo al home.');
        this.router.navigate(['/home']);
      }
    }
  }
}
