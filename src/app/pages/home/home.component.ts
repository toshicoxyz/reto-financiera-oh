import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  accordionOpenA = false;
  accordionOpenB = false;
  showUserMenu = false;
  userEmail = '';
  dropdownOpen = {
    workspaces: false,
    recent: false,
    marketplace: false,
    templates: false,
  };

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser();
    this.userEmail = user?.email || 'usuario@example.com';
  }

  @ViewChild('dropdownWorkspaces') dropdownWorkspaces!: ElementRef;
  @ViewChild('dropdownRecent') dropdownRecent!: ElementRef;
  @ViewChild('dropdownMarketplace') dropdownMarketplace!: ElementRef;
  @ViewChild('dropdownTemplates') dropdownTemplates!: ElementRef;

  toggleDropdown(menu: keyof typeof this.dropdownOpen) {
    this.dropdownOpen[menu] = !this.dropdownOpen[menu];
  }

  toggleAccordionA() {
    this.accordionOpenA = !this.accordionOpenA;
  }

  toggleAccordionB() {
    this.accordionOpenB = !this.accordionOpenB;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const isInsideAnyDropdown =
      this.dropdownWorkspaces?.nativeElement.contains(target) ||
      this.dropdownRecent?.nativeElement.contains(target) ||
      this.dropdownMarketplace?.nativeElement.contains(target) ||
      this.dropdownTemplates?.nativeElement.contains(target);

    if (!isInsideAnyDropdown) {
      this.dropdownOpen = {
        workspaces: false,
        recent: false,
        marketplace: false,
        templates: false,
      };
    }
  }
}
