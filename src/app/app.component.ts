import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  template: `
    <main [@routeAnimations]="getRouteAnimation(outlet)">
    	<router-outlet #outlet="outlet"></router-outlet>
    </main>`,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'absolute', width: '100%' }),
          {
            optional: true,
          }
        ),
        group([
          query(':leave', [animate('300ms ease-out', style({ opacity: 0 }))], {
            optional: true,
          }),
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              animate('300ms ease-in', style({ opacity: 1 })),
            ],
            {
              optional: true,
            }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'reto-financiera-oh';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getRouteAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
