import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { IOrder } from '../../core/Interfaces/order-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment/product.environment';
@Component({
  selector: 'app-pinding-orders',
  providers:[OrderService],
  imports: [CommonModule , FormsModule],
  templateUrl: './pinding-orders.html',
  styleUrl: './pinding-orders.css'
})
export class PindingOrders implements OnInit {
  staticURL=environment.uploadsURL
pendingOrders: IOrder[] = [];
  selectedOrderId: string | null = null;
  cancelReason: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getPendingOrders().subscribe({
      next: (res) => (this.pendingOrders = res.data),
      error: (err) => console.error('Error fetching pending orders:', err)
    });
  }

  updateStatus(orderId: string, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => this.loadOrders(),
      error: (err) => console.error(err)
    });
  }

  openCancelModal(orderId: string) {
    this.selectedOrderId = orderId;
    this.cancelReason = '';
    const modal = document.getElementById('cancelModal');
    if (modal) {
      const bsModal = new (window as any).bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  confirmCancel() {
    if (this.selectedOrderId) {
      this.orderService.updateOrderStatus(this.selectedOrderId, 'Cancelled', this.cancelReason).subscribe({
        next: () => {
          this.loadOrders();
          const modal = document.getElementById('cancelModal');
          if (modal) {
            const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
            bsModal.hide();
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}
