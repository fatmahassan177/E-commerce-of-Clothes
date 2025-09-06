import { Component } from '@angular/core';
import { IOrder } from '../../core/Interfaces/order-interface';
import { OrderService } from '../../core/services/order-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/product.environment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-orders-list',
   providers:[OrderService],
  imports: [CommonModule,FormsModule],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css'
})
export class OrdersList {
  StaticURL=environment.uploadsURL
 orders: IOrder[] = [];

  selectedOrderId: string | null = null;
  selectedStatus: string | null = null;
  cancelReason: string = '';


  constructor(private _orderS: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    
    this._orderS.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data
      },
    });
  }

  onStatusChange(orderId: string, status: string) {
    this.selectedOrderId = orderId;
    this.selectedStatus = status;

    if (status !== 'Cancelled') {
      this._orderS.updateOrderStatus(orderId, status).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('Error updating order status:', err)
      });
    }
  }

  confirmCancel(orderId: string) {
    if (!this.cancelReason.trim()) {
      alert('Please enter a reason for cancellation.');
      return;
    }

    this._orderS.updateOrderStatus(orderId, 'Cancelled', this.cancelReason).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrderId = null;
        this.selectedStatus = null;
        this.cancelReason = '';
      },
      error: (err) => console.error('Error cancelling order:', err)
    });
  }
}
