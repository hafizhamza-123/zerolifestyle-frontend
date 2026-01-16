import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ShoppingBag, Truck, Lock, AlertCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { schema } from '../validators/CheckoutSchema.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import API from '../api/axios.js';

const ZERO_LOGO_BLACK = "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/logo_x320.png?v=1676901766";

const Header = () => (
  <div className="w-full border-b border-gray-200 bg-white py-4 px-4 md:px-8 flex items-center justify-center sticky top-0 z-50 shadow-sm">
    <Link to="/"><img src={ZERO_LOGO_BLACK} alt="ZERO" className="h-8 object-contain" /></Link>
  </div>
);

const InputField = ({ register, name, placeholder, error, ...rest }) => (
  <div className="w-full">
    <div className="relative">
      <input
        {...register(name)}
        placeholder={placeholder}
        className={`w-full border rounded-md px-3 py-3 text-sm outline-none transition-all placeholder:text-gray-500
          ${error ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'}`}
        {...rest}
      />
    </div>
    {error && <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {error.message}</p>}
  </div>
);

const OrderSummary = ({ cart, subtotal, total }) => (
  <>
    <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
      {cart.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
          <div className="relative w-16 h-16 border border-gray-200 rounded-lg bg-white flex items-center justify-center shrink-0">
            <img src={item.image} alt={item.title} className="w-12 h-12 object-contain mix-blend-multiply" />
            <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">{item.quantity}</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{item.selectedColor}</p>
          </div>
          <p className="text-sm font-medium text-gray-800">Rs. {(item.price * item.quantity).toLocaleString()}</p>
        </div>
      ))}
    </div>

    <div className="flex gap-3 mb-8 border-b border-gray-200 pb-8">
      <input type="text" placeholder="Discount code" className="flex-1 border border-gray-300 rounded-md px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-shadow bg-white" />
      <button className="bg-[#E5E7EB] text-gray-500 font-bold px-5 rounded-md text-sm cursor-not-allowed hover:bg-gray-300 transition-colors">Apply</button>
    </div>

    <div className="space-y-3 mb-6 border-b border-gray-200 pb-6 text-sm text-gray-600">
      <div className="flex justify-between"><span>Subtotal • {cart.length} items</span><span className="font-medium text-black">Rs. {subtotal.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="flex items-center gap-1">Shipping <AlertCircle size={14} className="text-gray-400" /></span><span className="font-medium text-black">FREE</span></div>
    </div>

    <div className="flex justify-between items-center"><span className="text-lg font-bold text-gray-800">Total</span><div className="flex items-end gap-2"><span className="text-xs font-normal text-gray-500 mb-1">PKR</span><span className="text-2xl font-bold text-gray-900">Rs. {total.toLocaleString()}</span></div></div>
    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500"><span className="bg-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600">TOTAL SAVINGS</span><span>Rs 500.00</span></div>
  </>
);

const CheckoutPage = () => {
  const { cart, subtotal, clearCart } = useCart();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [billingOption, setBillingOption] = useState('same');
  const navigate = useNavigate();

  const total = subtotal;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data) => {
    try {
      if (!cart.length) {
        toast.error("Cart is empty");
        return;
      }

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode || "",
        phone: data.phone,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to place an order");
        return;
      }
      await API.post("/order/create", payload);

      toast.success("Order Placed Successfully!");
      clearCart();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to place order");
    }
  };

  const headerHeight = 64;

  useEffect(() => {
    const onScroll = () => {
      if (!rightRef.current || !leftRef.current) return;
      const top = rightRef.current.getBoundingClientRect().top;
      const stuck = top <= headerHeight + 1;
      if (stuck) {
        leftRef.current.classList.add('lg:overflow-y-auto');
        leftRef.current.classList.add('lg:h-[calc(100vh-4rem)]');
        leftRef.current.classList.add('hide-scrollbar');
      } else {
        leftRef.current.classList.remove('lg:overflow-y-auto');
        leftRef.current.classList.remove('lg:h-[calc(100vh-4rem)]');
        leftRef.current.classList.remove('hide-scrollbar');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900" style={{ fontFamily: 'var(--font-inter)' }}>
      <Header mobile />

      <div className="lg:hidden bg-[#FAFAFA] border-b border-gray-200 p-4">
        <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="flex items-center justify-between w-full text-black font-medium text-sm">
          <span className="flex items-center gap-2">
            <ShoppingBag size={16} /> {isSummaryOpen ? 'Hide' : 'Show'} order summary
            {isSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span className="text-black font-bold">Rs. {total.toLocaleString()}</span>
        </button>
        {isSummaryOpen && <div className="mt-4 pt-4 border-t border-gray-200"><OrderSummary cart={cart} subtotal={subtotal} total={total} /></div>}
      </div>

      <div className="flex flex-col lg:flex-row max-w-[1250px] mx-auto lg:max-w-full lg:px-0">
        <div ref={leftRef} className="flex-1 px-4 py-8 lg:py-8 lg:pr-14 lg:pt-14 lg:pl-12 lg:border-r border-gray-200 lg:max-w-[58%]">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

            {/* CONTACT */}
            <section>
              <h2 className="text-[17px] font-bold mb-3">Contact</h2>
              <InputField register={register} name="email" placeholder="Email" error={errors.email} />
              <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" id="news" className="accent-black w-4 h-4 rounded border-gray-300" />
                <label htmlFor="news" className="text-sm text-gray-600 cursor-pointer">Email me with news and offers</label>
              </div>
            </section>

            {/* DELIVERY */}
            <section className="space-y-3">
              <h2 className="text-[17px] font-bold mb-4">Delivery</h2>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white appearance-none cursor-pointer">
                  <option>Pakistan</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <InputField register={register} name="firstName" placeholder="First name" error={errors.firstName} />
                <InputField register={register} name="lastName" placeholder="Last name" error={errors.lastName} />
              </div>
              <InputField register={register} name="address" placeholder="Address" error={errors.address} />
              <div className="grid grid-cols-2 gap-3">
                <InputField register={register} name="city" placeholder="City" error={errors.city} />
                <input placeholder="Postal code (optional)" className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-500" />
              </div>
              <InputField register={register} name="phone" placeholder="Phone" error={errors.phone} />
            </section>

            {/* SHIPPING METHOD */}
            <section>
              <h2 className="text-[17px] font-bold mb-1">Shipping method</h2>
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">Free Delivery</span>
                </div>
                <span className="text-sm font-bold">FREE</span>
              </div>
            </section>

            {/* PAYMENT */}
            <section>
              <h2 className="text-[17px] font-bold mb-1">Payment</h2>
              <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {/* COD */}
                <div onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-[#F0F5FF] border-b border-black/10' : 'bg-white border-b border-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                  </div>
                  <label className="text-sm font-medium cursor-pointer flex-1">Cash on Delivery (COD)</label>
                </div>
                {paymentMethod === 'cod' && <div className="bg-[#F4F7FF] px-10 pb-4 pt-1 text-sm text-gray-500 border-b border-gray-200 animate-fadeIn">Pay with cash upon delivery.</div>}

                {/* ONLINE */}
                <div onClick={() => setPaymentMethod('online')} className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${paymentMethod === 'online' ? 'bg-[#F0F5FF]' : 'bg-white'}`}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-black' : 'border-gray-300'}`}>
                    {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-black"></div>}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm font-medium">PAYFAST (Visa/Mastercard)</span>
                    <div className="flex gap-1 opacity-80">
                      <CreditCard size={20} className="text-blue-600" /><CreditCard size={20} className="text-red-500" />
                    </div>
                  </div>
                </div>
                {paymentMethod === 'online' && (
                  <div className="bg-[#F4F7FF] px-10 pb-6 pt-2 text-center animate-fadeIn border-t border-gray-100">
                    <Lock size={48} className="mx-auto text-gray-300 mb-3 stroke-[1.5]" />
                    <p className="text-sm text-gray-500 leading-relaxed">After clicking “Complete order”, you will be redirected to PayFast to complete your purchase securely.</p>
                  </div>
                )}
              </div>
            </section>

            {/* BILLING */}
            <section>
              <h2 className="text-[17px] font-bold mb-4">Billing address</h2>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div onClick={() => setBillingOption('same')} className={`flex items-center gap-3 p-4 cursor-pointer ${billingOption === 'same' ? 'bg-[#F0F5FF] border-b border-gray-200' : 'bg-white border-b border-gray-200'}`}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${billingOption === 'same' ? 'border-black' : 'border-gray-300'}`}>{billingOption === 'same' && <div className="w-2 h-2 rounded-full bg-black"></div>}</div>
                  <label className="text-sm font-medium cursor-pointer">Same as shipping address</label>
                </div>
                <div onClick={() => setBillingOption('different')} className={`flex items-center gap-3 p-4 cursor-pointer ${billingOption === 'different' ? 'bg-[#F0F5FF]' : 'bg-white'}`}>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${billingOption === 'different' ? 'border-black' : 'border-gray-300'}`}>{billingOption === 'different' && <div className="w-2 h-2 rounded-full bg-black"></div>}</div>
                  <label className="text-sm font-medium cursor-pointer">Use a different billing address</label>
                </div>
                {billingOption === 'different' && <div className="bg-[#F0F5FF] p-4 border-t border-gray-200 animate-fadeIn"><input placeholder="Billing Address" className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black" /></div>}
              </div>
            </section>

            <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-md text-[15px] hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer">Complete order</button>

            <div className="flex flex-wrap gap-4 text-xs text-black underline">
              {['Refund policy', 'Shipping policy', 'Privacy policy', 'Terms of service', 'Contact information'].map(link => (
                <a key={link} href="#" className="hover:text-shadow-black">{link}</a>
              ))}
            </div>
          </form>
        </div>

        <div ref={rightRef} className="hidden lg:block w-[42%] bg-[#FAFAFA] border-l border-gray-200 px-10 py-14 lg:sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
          <OrderSummary cart={cart} subtotal={subtotal} total={total} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
