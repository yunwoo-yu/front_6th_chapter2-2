import { useState } from "react";
import Button from "../../../components/ui/Button";
import { ProductWithUI } from "../../../App";
import { ProductTable } from "../../../components/admin/ProductTable";
import { ProductForm } from "../../../components/admin/ProductForm";
import { useProductActions } from "../../../hooks/useProducts";

const ProductManagementSection = () => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const { addProduct, updateProduct } = useProductActions();

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(false);
  };

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }

    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            variant="primary"
            sizes="lg"
            className="text-sm"
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable handleEditProduct={handleEditProduct} />
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleProductSubmit={handleProductSubmit}
          handleCancelProduct={handleCancelProduct}
        />
      )}
    </section>
  );
};

export default ProductManagementSection;
