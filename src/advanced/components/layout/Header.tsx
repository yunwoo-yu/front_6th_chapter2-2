import { useCart } from "../../hooks/useCart";
import { CartIcon } from "../icons";
import Button from "../ui/Button";

interface HeaderProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBox = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="ml-8 flex-1 max-w-md">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="상품 검색..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  </div>
);

const CartBadge = ({ itemCount }: { itemCount: number }) => (
  <div className="relative">
    <CartIcon className="w-6 h-6 text-gray-700" />
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </div>
);

const AdminToggleButton = ({
  isAdmin,
  onToggle,
}: {
  isAdmin: boolean;
  onToggle: () => void;
}) => (
  <Button onClick={onToggle} variant={isAdmin ? "primary" : "ghost"} sizes="md">
    {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
  </Button>
);

export const Header = ({
  isAdmin,
  onToggleAdmin,
  searchTerm,
  onSearchChange,
}: HeaderProps) => {
  const { totalItemCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdmin && (
              <SearchBox value={searchTerm} onChange={onSearchChange} />
            )}
          </div>
          <nav className="flex items-center space-x-4">
            <AdminToggleButton isAdmin={isAdmin} onToggle={onToggleAdmin} />
            {!isAdmin && <CartBadge itemCount={totalItemCount} />}
          </nav>
        </div>
      </div>
    </header>
  );
};
