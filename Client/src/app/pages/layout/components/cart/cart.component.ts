import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Course } from 'src/app/models/Course.model';
import { CartState } from 'src/app/ngrx/states/cart.state';
import * as CartAction from 'src/app/ngrx/actions/cart.actions';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {
  cartList$ = this.store.select((state) => state.cart.cartList);
  cartList: Course[] = [];
  total$ = this.store.select((state) => state.cart.total);
  total: number = 0;
  constructor(
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
    private router: Router,
    private store: Store<{ cart: CartState }>
  ) {
    console.log('chay chua');
    console.log(this.cartList$);
  }
  ngOnInit(): void {
    this.cartList$.subscribe((cartList) => {
      if (cartList != undefined) {
        this.cartList = cartList;
        console.log(this.cartList);
      }
    });
  }

  addCourseToCart(course: Course) {
    this.store.dispatch(CartAction.addCourseToCart({ course }));
  }
  removeCourseFromCart(course: Course) {
    this.store.dispatch(CartAction.removeCourseFromCart({ course }));
  }
  clearAllCart() {
    this.store.dispatch(CartAction.clearAllCart());
  }

  backhome() {
    this.router.navigate(['/base/home']);
  }

  search = '';

  buyButton() {
    if (this.cartList.length === 0) {
      this.warningNotification('Không có course nào trong cart.');
    } else {
      this.cartList = [];
      this.total = 0;
      this.successNotification('Mua thành công');
    }
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
}
