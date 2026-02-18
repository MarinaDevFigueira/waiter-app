import type { OrderStatus } from "@/shared/schemas/order.schema";

interface OrderItem {
  name: string;
  quantity: number;
  preco: number;
}

interface Order {
  id: string;
  table: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}

interface StatusOption {
  value: OrderStatus;
  label: string;
}

export interface OrdersGridProps {
  orders: Order[];
  searchQuery: string;
  formatDate: (timestamp: Date) => string;
  formatTime: (timestamp: Date) => string;
  handleStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  statusOptions: StatusOption[];
  getStatusLabel: (status: OrderStatus) => string;
}
