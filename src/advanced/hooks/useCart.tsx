import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, Coupon } from "../../types";

import { ProductWithUI } from "../App";
import {
  addItemToCart,
  calculateCartTotal,
  getRemainingStock,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useNotificationActions } from "./useNotification";

interface CartContextTypes {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  totalItemCount: number;
}

interface CartContextActionsTypes {
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  unapplyCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextTypes>({
  cart: [],
  selectedCoupon: null,
  totalItemCount: 0,
});

const CartContextActions = createContext<CartContextActionsTypes>({
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  applyCoupon: () => {},
  unapplyCoupon: () => {},
  clearCart: () => {},
});

export const CartProvider = memo(({ children }: PropsWithChildren) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []); // 장바구니 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const { addNotification } = useNotificationActions();

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => addItemToCart(prevCart, product));
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const cartItem = cart.find((item) => item.product.id === productId);

      if (!cartItem?.product) return;

      const maxStock = cartItem.product.stock;

      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        updateCartItemQuantity(prevCart, productId, newQuantity)
      );
    },
    [cart, removeFromCart, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  const unapplyCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const value = useMemo(() => {
    return {
      cart,
      selectedCoupon,
      totalItemCount,
    };
  }, [cart, selectedCoupon, totalItemCount]);

  const actions = useMemo(() => {
    return {
      addToCart,
      removeFromCart,
      updateQuantity,
      applyCoupon,
      unapplyCoupon,
      clearCart,
    };
  }, [
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    unapplyCoupon,
    clearCart,
  ]);

  return (
    <CartContext.Provider value={value}>
      <CartContextActions.Provider value={actions}>
        {children}
      </CartContextActions.Provider>
    </CartContext.Provider>
  );
});

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export const useCartActions = () => {
  const context = useContext(CartContextActions);

  if (!context) {
    throw new Error("useCartActions must be used within a CartProvider");
  }

  return context;
};
