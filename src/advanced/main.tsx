import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NotificationProvider } from "./hooks/useNotification";
import { CartProvider } from "./hooks/useCart.tsx";
import { CouponProvider } from "./hooks/useCoupon.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <CartProvider>
        <CouponProvider>
          <App />
        </CouponProvider>
      </CartProvider>
    </NotificationProvider>
  </React.StrictMode>
);
