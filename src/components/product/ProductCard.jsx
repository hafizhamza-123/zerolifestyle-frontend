import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext.jsx';

const ProductCard = ({ product, fluid = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toast.success(`${product.name} x${product.quantity || 1} Added to cart!`);
    addToCart(product, 1);
  };

  const widthClasses = fluid
    ? "w-full min-w-0"
    : "w-full min-w-[260px] md:min-w-[290px]";

  return (
    <div className={`group ${widthClasses} bg-white border border-[#dbd9da] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 relative hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer`}>
      <div className="bg-[#F9F8FC] rounded-2xl overflow-hidden p-2 sm:p-3 mb-2.5 sm:mb-3">
        <div className="flex justify-between items-center mb-2.5 sm:mb-3 px-1">
          <span className="text-[9px] sm:text-[11px] font-bold text-[#D0264F] uppercase truncate pr-2">
            {product.tag || "BEST SELLER"}
          </span>
          <div className="flex items-center gap-1.5">
            <Star size={13} className="sm:w-[15px] sm:h-[15px]" fill="#FFC107" strokeWidth={0} />
            <span className="text-[11px] sm:text-[13px] font-bold">4.8</span>
          </div>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="block relative w-full aspect-square bg-[#F9F8FC] rounded-2xl overflow-hidden"
        >
          <img
            src={product.featuredImage}
            alt={product.name}
            className="w-full h-full object-contain p-2.5 sm:p-3 group-hover:scale-105 transition-transform"
          />
        </Link>
      </div>
      <Link to={`/product/${product.id}`} className="block">
        <h3 className="font-bold text-[14px] sm:text-[17px] leading-snug px-1 line-clamp-2 hover:text-[#4a00e0] transition-colors">{product.name}</h3>
      </Link>

      <p className="text-[11px] sm:text-[13px] text-gray-500 mb-2.5 sm:mb-3 px-1 line-clamp-2">
        {product.description || "Premium Quality Product"}
      </p>

      <div className="flex items-end justify-between gap-2 px-1">
        <div className="min-w-0">
          {product.price && (
            <p className="text-[10px] sm:text-[11px] line-through text-gray-400 truncate">
              Rs.{product.price.toLocaleString()}
            </p>
          )}
          <p className="text-[16px] sm:text-[22px] font-semibold truncate">
            Rs.{product.discountedPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="shrink-0 bg-[#4a00e0] text-white text-[10px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 rounded-full cursor-pointer whitespace-nowrap"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
