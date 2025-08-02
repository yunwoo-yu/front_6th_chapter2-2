import { applyCoupon } from "../../refactoring(hint)/models/coupon";
import { CartItem, Coupon } from "../../types";
import { getMaxApplicableDiscount } from "./discount";

interface CartTotal {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  const subtotal = price * quantity;
  const discountedAmount = subtotal * (1 - discount);

  return Math.round(discountedAmount);
};

export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): CartTotal => {
  const totalBeforeDiscount = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const totalAfterDiscount = applyCoupon(
    cart.reduce((total, item) => {
      return total + calculateItemTotal(item, cart);
    }, 0),
    coupon
  );

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
