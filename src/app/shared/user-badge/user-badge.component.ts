import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CircularContentComponent } from '../circular-content/circular-content.component';
import { ButtonComponent } from '../button/button.component';
import { UserService } from '@services/user.service';
import { UserData } from '@types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'flw-user-badge',
  standalone: true,
  imports: [CircularContentComponent, ButtonComponent],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.scss'
})
export class UserBadgeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() user!: UserData;
  @Output() onClick: EventEmitter<undefined> = new EventEmitter<undefined>();

  initials: string = '';

  private subs: {[key: string]: Subscription} = {};

  constructor(private userService: UserService) { }
  ngOnInit() {
    this.initials = (this.user.firstName?.charAt(0) + this.user.lastName?.charAt(0)) || '';
  }

  ngAfterViewInit(): void {
    this.subs['userData'] = this.userService.userData$.subscribe((data) => {
      this.initials = (data.firstName?.charAt(0) + data.lastName?.charAt(0)) || '';
    });
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  logout() {
    this.userService.logout();
  }
}
