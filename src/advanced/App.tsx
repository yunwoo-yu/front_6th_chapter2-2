import { useState } from "react";
import { Product } from "../types";
import { Header } from "./components/layout";
import { CartProvider } from "./hooks/useCart.tsx";
import { CouponProvider } from "./hooks/useCoupon.tsx";
import { NotificationProvider } from "./hooks/useNotification.tsx";
import { ProductProvider } from "./hooks/useProducts.tsx";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import { useDebounce } from "./utils/hooks/useDebounce";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export const SOLD_OUT_TEXT = "SOLD OUT";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <NotificationProvider>
      <CartProvider>
        <CouponProvider>
          <ProductProvider>
            <div className="min-h-screen bg-gray-50">
              <Header
                isAdmin={isAdmin}
                onToggleAdmin={() => setIsAdmin(!isAdmin)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              <main className="max-w-7xl mx-auto px-4 py-8">
                {isAdmin && <AdminPage />}
                {!isAdmin && (
                  <CartPage debouncedSearchTerm={debouncedSearchTerm} />
                )}
              </main>
            </div>
          </ProductProvider>
        </CouponProvider>
      </CartProvider>
    </NotificationProvider>
  );
};

export default App;
