import { Injectable, booleanAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { CartItem } from '../models/cart-item';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';
import { NewOrderRequest } from '../models/new-order-request';
import { UsersService } from './users.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private ordersAPIURL: string = environment.ordersAPIURL;
    private cart: CartItem[] = [];

    constructor(private http: HttpClient, private usersService: UsersService) {
    }

    addCartItem(cartItem: CartItem): void {
        var isFound: boolean = false;
        this.cart = this.cart.map(item => {
            //console.log(item.productId, cartItem.productId, item.productId == cartItem.productId);
            if (item.productId == cartItem.productId) {
                item.quantity++;
                isFound = true;
            }
            return item;
        });

        //console.log(cartItem, isFound);
        if (!isFound) {
            cartItem.quantity = 1;
            this.cart.push(cartItem);
        }
    }

    removeCartItem(productId: string): void {
        var shouldRemoveItem: boolean = false;

        //console.log(this.cart, productId);

        this.cart = this.cart.map(item => {
            if (item.productId == productId) {
                if (item.quantity > 1)
                    item.quantity--;
                else
                    shouldRemoveItem = true;
            }
            return item;
        });

        //console.log(this.cart, productId, shouldRemoveItem);

        if (shouldRemoveItem) {
            this.cart = this.cart.filter(item => {
                return item.productId != productId;
            })
        }
    }

    clearCartItems(): void {
        this.cart = [];
    }

    getCartItems(): CartItem[] {
        return this.cart;
    }

    newOrder(): Observable<OrderResponse> {
        var newOrderRequest: NewOrderRequest = {
            userId: this.usersService.authResponse?.userId!,
            orderDate: new Date(),
            orderItems: []
        };
        this.cart.forEach(cartItem => {
            newOrderRequest.orderItems.push({
                productId: cartItem.productId,
                unitPrice: cartItem.unitPrice,
                quantity: cartItem.quantity
            });
        });
        console.log(newOrderRequest);
        console.log(this.usersService.authResponse);
        console.log(this.cart);
        return this.http.post<OrderResponse>(`${this.ordersAPIURL}`, newOrderRequest);
    }

    getOrdersByuserId(userId: string): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.ordersAPIURL}search/userId/${userId}`);
    }

    getOrders(): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.ordersAPIURL}`);
    }
}
