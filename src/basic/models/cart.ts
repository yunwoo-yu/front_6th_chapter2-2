import { CartItem } from "../../types";
import { getMaxApplicableDiscount } from "./discount";

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
