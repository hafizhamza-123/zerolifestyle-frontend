import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toast.success(`${product.name} x${product.quantity || 1} Added to cart!`);
    addToCart(product, 1);
  };

  return (
    <div className="group min-w-[260px] md:min-w-[290px] bg-white border border-[#dbd9da] rounded-3xl p-3.5 relative hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer">
      <div className="bg-[#F9F8FC] rounded-[20px] overflow-hidden p-3 mb-3">
        <div className="flex justify-between items-center mb-3 px-1.5">
          <span className="text-[11px] font-bold text-[#D0264F] uppercase">
            {product.tag || "BEST SELLER"}
          </span>
          <div className="flex items-center gap-1.5">
            <Star size={15} fill="#FFC107" strokeWidth={0} />
            <span className="text-[13px] font-bold">4.8</span>
          </div>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="block relative w-full aspect-square bg-[#F9F8FC] rounded-[20px] overflow-hidden"
        >
          <img
            src={product.featuredImage}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      <Link to={`/product/${product.id}`} className="block">
        <h3 className="font-bold text-[17px] px-1 hover:text-[#4a00e0] transition-colors">{product.name}</h3>
      </Link>

      <p className="text-[13px] text-gray-500 mb-3 px-1">
        {product.description || "Premium Quality Product"}
      </p>

      <div className="flex items-end justify-between px-1">
        <div>
          {product.price && (
            <p className="text-[11px] line-through text-gray-400">
              Rs.{product.price.toLocaleString()}
            </p>
          )}
          <p className="text-[22px] font-semibold">
            Rs.{product.discountedPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-[#4a00e0] text-white text-[12px] py-2 px-4 rounded-full cursor-pointer"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
