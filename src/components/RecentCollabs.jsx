import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { RECENT_COLLABS } from '../data/mockData.js';

const VideoCard = ({ collab, shouldPlay }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlay) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      } else {
        videoRef.current.pause(); 
      }
    }
  }, [shouldPlay]);

  return (
    <div className="relative w-full aspect-9/16 rounded-xl overflow-hidden group bg-gray-100 transition-transform duration-300">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${shouldPlay ? 'opacity-100' : 'opacity-90'}`}
        src={collab.video}
        poster={collab.poster}
        loop
        muted
        playsInline
      />
      
      <a 
        href={collab.link}
        className="absolute bottom-4 right-4 bg-white text-black text-[11px] font-bold py-2 px-5 rounded-full hover:bg-gray-100 transition-colors shadow-lg z-10"
      >
        Shop Now
      </a>
    </div>
  );
};

const RecentCollabs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [middleOffset, setMiddleOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setMiddleOffset(0);
      } else if (width < 1024) {
        setMiddleOffset(1);
      } else {
        setMiddleOffset(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        <h2 className="text-xl font-inter font-semibold text-black mb-6 px-3">Recent Collabs</h2>
        
        <Swiper
          spaceBetween={16}
          slidesPerView={1.5}
          grabCursor={true}

          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          breakpoints={{
            640: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 4.5, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 }
          }}
          className="w-full pb-4!"
        >
          {RECENT_COLLABS.map((collab, index) => {
            const isPlaying = index === (activeIndex + middleOffset);

            return (
              <SwiperSlide key={collab.id} className="h-auto">
                <VideoCard collab={collab} shouldPlay={isPlaying} />
              </SwiperSlide>
            );
          })}
        </Swiper>

      </div>
    </section>
  );
};

export default RecentCollabs;