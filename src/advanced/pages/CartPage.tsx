import { Coupon } from "../../types";
import { ProductWithUI } from "../App";
import { Cart } from "../components/cart/Cart";
import { ProductList } from "../components/product/ProductList";

interface CartPageProps {
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  coupons: Coupon[];
  getProductPriceDisplay: (price: number, productId: string) => string;
}

const CartPage = ({
  products,
  debouncedSearchTerm,
  coupons,
  getProductPriceDisplay,
}: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList
          products={products}
          debouncedSearchTerm={debouncedSearchTerm}
          getProductPriceDisplay={getProductPriceDisplay}
        />
      </div>
      <div className="lg:col-span-1">
        <Cart coupons={coupons} />
      </div>
    </div>
  );
};

export default CartPage;
