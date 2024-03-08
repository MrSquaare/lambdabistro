export type OrderItem = {
  dish_id: string;
  quantity: number;
};

export enum OrderStatus {
  TODO,
  DONE,
}

export type Order = {
  client_id: string;
  items: OrderItem[];
  status: OrderStatus;
};
