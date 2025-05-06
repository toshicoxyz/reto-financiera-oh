import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'reto-financiera-oh';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
