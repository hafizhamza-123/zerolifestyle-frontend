import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HERO_SLIDES = [
  {
    id: 1,
    title: "11.11 Secret Code",
    mobile: "https://zerolifestyle.co/cdn/shop/files/secret-code-mob.webp?v=1762780074&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/secret-code-banner.webp?v=1762780075&width=1920",
    link: "/product/6952769c120acaa587980189"
  },
  {
    id: 2,
    title: "Navigator Smartwatch",
    mobile: "https://zerolifestyle.co/cdn/shop/files/mobile_4.webp?v=1764337998&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/desktop_4.webp?v=1764338005&width=1920",
    link: "/product/6952769c120acaa587980189"
  },
  {
    id: 3,
    title: "Evo Earbuds",
    mobile: "https://zerolifestyle.co/cdn/shop/files/evo-mobile.webp?v=1763992829&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/evo-desktop.webp?v=1763992829&width=1920",
    link: "/product/6952769c120acaa587980189"
  },
  {
    id: 4,
    title: "Sahibzada Farhan Collab",
    mobile: "https://zerolifestyle.co/cdn/shop/files/mobile_copy_1_1.webp?v=1763360590&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/desktop_copy_1.webp?v=1763360590&width=1920",
    link: "/product/6957c4f329d87575d84749f0"
  },
  {
    id: 5,
    title: "Zero Visionary",
    mobile: "https://zerolifestyle.co/cdn/shop/files/visionary_phone_LIVE_NOW.webp?v=1760093197&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/visionary_desktop_LIVE_NOW.webp?v=1760093197&width=1920",
    link: "/product/69679abe123f2520f036fdb9"
  },
  {
    id: 6,
    title: "Zenith Headphones",
    mobile: "https://zerolifestyle.co/cdn/shop/files/zenioth_phone_copy_5effd2af-2017-4ca6-9e95-f1ec3f9c122a.webp?v=1759128844&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/zenioth_desktop_copy_196c8dd4-b3de-435b-8f3a-fd92bfe07b45.webp?v=1759128844&width=1920",
    link: "/product/6952769c120acaa587980189"

  },
  {
    id: 7,
    title: "Legacy Smartwatch",
    mobile: "https://zerolifestyle.co/cdn/shop/files/legacy_mobile_copy.webp?v=1758363797&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/legacy_desktop_copy.webp?v=1758363796&width=1920",
    link: "/product/69679a4f123f2520f036fdb8"
  },
  {
    id: 8,
    title: "Luna Pro",
    mobile: "https://zerolifestyle.co/cdn/shop/files/luna_pro_mobile_copy.webp?v=1758199741&width=600",
    desktop: "https://zerolifestyle.co/cdn/shop/files/luna_pro_desktop_copy.webp?v=1758199741&width=1920",
    link: "/product/696799c2123f2520f036fdb7"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideGradients = [
    "linear-gradient(to bottom, #1d2397, #ffffff)", 
    "linear-gradient(to bottom, #000000, #ffffff)", 
    "linear-gradient(to bottom, #ff1600, #ffffff)", 
    "linear-gradient(to bottom, #b7271c, #ffffff)", 
    "linear-gradient(to bottom, #ff9f64, #ffffff)",  
    "linear-gradient(to bottom, #733326, #ffffff)", 
    "linear-gradient(to bottom, #000000, #ffffff)", 
    "linear-gradient(to bottom, #313a47, #ffffff)", 
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    // console.count("Slide changed");

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-full transition-all duration-700 ease-in-out pt-13"
      style={{ background: slideGradients[currentSlide] || slideGradients[0] }}
    >
      
      <div className="w-full max-w-[1800px] mx-auto px-4 pt-4 pb-8 md:px-8 md:pt-4 md:pb-12">
        
        <div className="relative w-full aspect-4/5 md:aspect-24/9 rounded-3xl overflow-hidden ">
          
          {HERO_SLIDES.map((slide, index) => (
            <Link
              to={slide.link}
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out block
              ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
               <picture>
                 <source media="(min-width: 768px)" srcSet={slide.desktop} />
                 <img 
                   src={slide.mobile} 
                   alt={slide.title || "Zero Lifestyle"} 
                   className="w-full h-full object-cover object-center" 
                 />
               </picture>
            </Link>
          ))}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer
                  ${currentSlide === idx 
                    ? 'w-8 bg-white shadow-md' 
                    : 'w-2 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;