import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

export interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  orderSessionId: string | null;
  total: number;
}

const getStoredCart = (): CartData => {
  const stored = sessionStorage.getItem(StorageKeys.CART);
  const isStoredValid = stored !== null;
  if (isStoredValid) {
    return JSON.parse(stored) as CartData;
  }
  return { items: [], orderSessionId: null, total: 0 };
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
};

const initialCart = getStoredCart();

const cartSubject = new BehaviorSubject<CartData>(initialCart);

export const cartObservable = {
  subscribe: (callback: (value: CartData) => void): Subscription =>
    cartSubject.subscribe(callback),

  getValue: (): CartData => cartSubject.getValue(),

  addItem: (item: Omit<CartItem, "quantity">, quantity = 1): void => {
    const current = cartSubject.getValue();
    const existingItemIndex = current.items.findIndex(
      (i) => i.productId === item.productId
    );

    let newItems: CartItem[];

    const itemExists = existingItemIndex !== -1;
    if (itemExists) {
      newItems = [...current.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      newItems = [...current.items, { ...item, quantity }];
    }

    const newTotal = calculateTotal(newItems);
    const newCart: CartData = {
      ...current,
      items: newItems,
      total: newTotal,
    };

    sessionStorage.setItem(StorageKeys.CART, JSON.stringify(newCart));
    cartSubject.next(newCart);
  },

  removeItem: (productId: string): void => {
    const current = cartSubject.getValue();
    const newItems = current.items.filter((i) => i.productId !== productId);
    const newTotal = calculateTotal(newItems);
    const newCart: CartData = {
      ...current,
      items: newItems,
      total: newTotal,
    };

    sessionStorage.setItem(StorageKeys.CART, JSON.stringify(newCart));
    cartSubject.next(newCart);
  },

  updateQuantity: (productId: string, quantity: number): void => {
    const current = cartSubject.getValue();
    const itemIndex = current.items.findIndex((i) => i.productId === productId);

    const itemNotFound = itemIndex === -1;
    if (itemNotFound) return;

    const shouldRemoveItem = quantity <= 0;
    if (shouldRemoveItem) {
      cartObservable.removeItem(productId);
      return;
    }

    const newItems = [...current.items];
    newItems[itemIndex] = { ...newItems[itemIndex], quantity };
    const newTotal = calculateTotal(newItems);
    const newCart: CartData = {
      ...current,
      items: newItems,
      total: newTotal,
    };

    sessionStorage.setItem(StorageKeys.CART, JSON.stringify(newCart));
    cartSubject.next(newCart);
  },

  setOrderSession: (orderSessionId: string | null): void => {
    const current = cartSubject.getValue();
    const newCart: CartData = { ...current, orderSessionId };
    sessionStorage.setItem(StorageKeys.CART, JSON.stringify(newCart));
    cartSubject.next(newCart);
  },

  clearCart: (): void => {
    const emptyCart: CartData = { items: [], orderSessionId: null, total: 0 };
    sessionStorage.removeItem(StorageKeys.CART);
    cartSubject.next(emptyCart);
  },

  getItemCount: (): number => {
    const current = cartSubject.getValue();
    return current.items.reduce((count, item) => count + item.quantity, 0);
  },
};
