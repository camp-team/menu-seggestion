import { Component, OnInit } from '@angular/core';
import { MyMenuService } from 'src/app/services/my-menu.service';
import { Observable } from 'rxjs';
import { DayMenuWithFood } from '@interfaces/my-menu';
import { AuthService } from 'src/app/services/auth.service';
import { tap, take } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  private userId: string = this.authService.userId;

  weekMenu$: Observable<
    DayMenuWithFood[]
  > = this.myMenuService.getDayMenuWithFoods(this.userId).pipe(
    take(1),
    tap(() => this.loadingService.toggleLoading(false))
  );

  constructor(
    private myMenuService: MyMenuService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private titleService: TitleService
  ) {
    this.loadingService.toggleLoading(true);
    this.titleService.setTitle('一週間の献立');
  }

  ngOnInit(): void {}
}
