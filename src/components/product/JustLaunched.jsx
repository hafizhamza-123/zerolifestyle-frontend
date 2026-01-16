import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from './ProductCard.jsx';
import API from '../../api/axios.js';

const JustLaunched = () => {
  const [activeTab, setActiveTab] = useState('watches');
  const [watches, setWatches] = useState([]);
  const [earbuds, setEarbuds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoriesRes = await API.get('/categories'); 
        const categories = categoriesRes.data.categories || [];

        const watchesCategory = categories.find(c => c.name.toLowerCase().includes('watch'));
        const earbudsCategory = categories.find(c => c.name.toLowerCase().includes('earbud'));

        if (!watchesCategory || !earbudsCategory) {
          console.error('Required categories not found in database');
          setLoading(false);
          return;
        }

        const [watchesRes, earbudsRes] = await Promise.all([
          API.get(`/categories/products/${watchesCategory.id}`),
          API.get(`/categories/products/${earbudsCategory.id}`)
        ]);

        setWatches(watchesRes.data.products || []);
        setEarbuds(earbudsRes.data.products || []);
      } catch (err) {
        console.error('Failed to fetch Just Launched products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const currentProducts = activeTab === 'watches' ? watches : earbuds;

  if (loading) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <h2 className="text-xl font-inter font-semibold text-black self-start md:self-auto px-3">
            Just Launched
          </h2>

          <div className="flex bg-[#f3f4f6] p-1.5 rounded-full">
            <button
              onClick={() => setActiveTab('watches')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 tracking-wide cursor-pointer ${
                activeTab === 'watches' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-transparent text-gray-500 hover:text-black'
              }`}
            >
              SMART WATCHES
            </button>
            <button
              onClick={() => setActiveTab('earbuds')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 tracking-wide cursor-pointer ${
                activeTab === 'earbuds' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-transparent text-gray-500 hover:text-black'
              }`}
            >
              ZERO EARBUDS
            </button>
          </div>
        </div>

        <div className="w-full">
          <Swiper
            spaceBetween={16} 
            slidesPerView={1.2}
            grabCursor={true}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              768: { slidesPerView: 2.3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="w-full pb-8!"
          >
            {currentProducts.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default JustLaunched;
