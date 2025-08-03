import { Cart } from "../components/cart/Cart";
import { ProductList } from "../components/product/ProductList";

interface CartPageProps {
  debouncedSearchTerm: string;
}

const CartPage = ({ debouncedSearchTerm }: CartPageProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <ProductList debouncedSearchTerm={debouncedSearchTerm} />
      </div>
      <div className="lg:col-span-1">
        <Cart />
      </div>
    </div>
  );
};

export default CartPage;
