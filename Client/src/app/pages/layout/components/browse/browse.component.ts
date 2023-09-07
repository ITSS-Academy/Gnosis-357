import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { Store } from '@ngrx/store';
import { CourseState } from 'src/app/ngrx/states/course.state';
import * as CourseAction from 'src/app/ngrx/actions/course.actions';
import * as CartAction from 'src/app/ngrx/actions/cart.actions';
import { CartState } from 'src/app/ngrx/states/cart.state';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthState } from 'src/app/ngrx/states/auth.state';
import { ProfileState } from 'src/app/ngrx/states/profile.state';
import { Profile } from 'src/app/models/profile.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.less'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  courseList$: Observable<Course[]> = this.store.select('course', 'courseList');
  courselist: Course[] = [];
  cartList$ = this.store.select('cart', 'cartList');
  cartList: Course[] = [];
  idToken$: Observable<string> = this.store.select('auth', 'idToken');
  profile$: Observable<Profile> = this.store.select('profile', 'profile');
  subscriptions: Subscription[] = [];
  musicCourses: Course[] = [];
  webDeveloper: Course[] = [];

  readonly testForm = new FormGroup({
    testValue: new FormControl('All'),
  });
  readonly courses_category = [
    'All',
    'Popular',
    'Web Developer',
    'Computer Sciene',
    'English',
    'Music',
    'Cook',
  ];

  state_category: string | undefined = '';
  onRadioChange(selectedState: string) {
    this.state_category = selectedState;
    console.log(this.state_category);
  }

  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private store: Store<{
      course: CourseState;
      cart: CartState;
      auth: AuthState;
      profile: ProfileState;
    }>
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((val) => {
      val.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartList$.subscribe((cartList) => {
        if (cartList != undefined && cartList != null && cartList.length > 0) {
          this.cartList = [...cartList];
          console.log('cartList: ', this.cartList);
        }
      }),
      this.courseList$.subscribe((item) => {
        console.log('item: ', item);
        if (item != undefined && item != null && item.length > 0) {
          this.courselist = [...item];
          console.log('courseList: ', this.courselist);
          this.musicCourses = item.filter(
            (course) => course.category == 'Music'
          );
          this.webDeveloper = item.filter(
            (course) => course.category == 'Frontend Developer'
          );
        }
      }),
      combineLatest({
        idToken: this.idToken$,
        profile: this.profile$,
      }).subscribe((res) => {
        if (
          res.idToken != undefined &&
          res.idToken != null &&
          res.idToken != '' &&
          res.profile != undefined &&
          res.profile != null
        ) {
          console.log(res);
          this.store.dispatch(
            CourseAction.getByUser({
              idToken: res.idToken,
              userId: res.profile.id,
            })
          );
        }
      }),
      this.store.select('course', 'getErrMess').subscribe((val) => {
        if (val != '') {
          this.alerts.open(val, { status: 'error' }).subscribe();
        }
      })
    );
  }

  backhome() {
    this.router.navigate(['/base/home']);
  }

  description(id: string) {
    this.router.navigate([`/base/browse/detail/${id}`]);
  }

  addCourseToCart(course: Course) {
    let isExist = false;
    this.cartList.forEach((item) => {
      console.log(item);
      if (item._id == course._id) {
        this.warningNotification(`${course.name} is already in the cart`);
        isExist = true;
        return;
      }
    });
    if (isExist) {
      return;
    }
    this.store.dispatch(CartAction.addCourseToCart({ course }));
    this.successNotification(`${course.name} has been added to the cart`);
  }

  successNotification(message: string): void {
    this.alerts
      .open('', {
        label: message,
        status: 'success',
        autoClose: 4000,
      })
      .subscribe();
  }
  warningNotification(message: string): void {
    this.alerts
      .open('', {
        label: message,
        status: 'warning',
        autoClose: 4000,
      })
      .subscribe();
  }

  search = '';
}
