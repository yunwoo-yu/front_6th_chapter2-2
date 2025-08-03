import {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { useCart, useCartActions } from "./useCart";
import { useNotificationActions } from "./useNotification";

type CouponContextTypes = Coupon[];

interface CouponContextActionsTypes {
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
}

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const CouponContext = createContext<CouponContextTypes>(initialCoupons);

const CouponContextActions = createContext<CouponContextActionsTypes>({
  addCoupon: () => {},
  deleteCoupon: () => {},
});

export const CouponProvider = memo(({ children }: PropsWithChildren) => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    "coupons",
    initialCoupons
  );
  const { addNotification } = useNotificationActions();
  const { selectedCoupon } = useCart();
  const { unapplyCoupon } = useCartActions();

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(
        (coupon) => coupon.code === newCoupon.code
      );

      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));

      if (selectedCoupon?.code === couponCode) {
        unapplyCoupon();
      }

      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  const actions = useMemo(
    () => ({
      addCoupon,
      deleteCoupon,
    }),
    [addCoupon, deleteCoupon]
  );

  return (
    <CouponContext.Provider value={coupons}>
      <CouponContextActions.Provider value={actions}>
        {children}
      </CouponContextActions.Provider>
    </CouponContext.Provider>
  );
});

export const useCoupon = () => {
  const context = useContext(CouponContext);

  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }

  return context;
};

export const useCouponActions = () => {
  const context = useContext(CouponContextActions);

  if (!context) {
    throw new Error("useCouponActions must be used within a CouponProvider");
  }

  return context;
};
