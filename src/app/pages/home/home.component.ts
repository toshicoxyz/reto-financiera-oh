import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  accordionOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleAccordion() {
    this.accordionOpen = !this.accordionOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
