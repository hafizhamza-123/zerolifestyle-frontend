import { ArrowRight, CheckCircle2, Heart, Zap } from 'lucide-react';
import { FEATURED_LAUNCHES } from '../data/mockData.js';

const FeaturedLaunches = () => {

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">
        <h2 className="text-xl font-inter font-semibold text-black mb-6 px-3">Featured Launches</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_LAUNCHES.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center text-white hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide cursor-pointer transition-colors
                    ${idx === item.activeTagIndex 
                      ? 'bg-[#1f2937] text-white' 
                      : 'bg-[#f3f4f6] text-gray-600 hover:bg-gray-200'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-full aspect-4/3 rounded-2xl overflow-hidden mb-6 bg-gray-50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">{item.footerText}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium text-gray-500">

                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-green-500 fill-green-500 stroke-white" />
                    <span>{item.stats.sold} sold</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-red-500 fill-red-500 stroke-white" />
                    <span>{item.stats.wishlist} wishlisted</span>
                  </div>
                  {item.stats.trending && (
                    <div className="flex items-center gap-1 text-[#d946ef]">
                      <Zap size={12} fill="currentColor" />
                      <span className="font-bold uppercase">TRENDING</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedLaunches;