import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { PROMISE_IMAGES } from '../data/mockData.js';

const ZerosPromise = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 md:px-5">
        <h2 className="text-xl font-inter font-semibold text-black mb-6 px-3">Zero's Promise</h2>
        
        <Swiper
          spaceBetween={16}
          slidesPerView={1.3} 
          grabCursor={true}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4, 
              spaceBetween: 24,
            },
          }}
          className="w-full"
        >
          {PROMISE_IMAGES.map((item) => (
            <SwiperSlide key={item.id} className="h-auto transition-transform duration-300 hover:scale-[1.03]">
              <a href={item.link} className="block h-full group">
                <img 
                  src={item.image} 
                  alt="Zero Promise" 
                  className="w-full h-full object-contain rounded-2xl shadow-sm "
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default ZerosPromise;