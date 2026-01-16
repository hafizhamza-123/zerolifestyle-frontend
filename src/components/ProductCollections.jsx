import { collections1 } from '../data/mockData.js';
import { ArrowRight } from 'lucide-react';

const ProductCollections = () => {
  return (
    <section className="py-8 bg-[#f5f5f5]">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <div className="grid grid-cols-2 gap-4 order-last lg:order-1">
            {collections1.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl p-5 relative overflow-hidden group hover:shadow-lg flex flex-col justify-between h-60 md:h-[300px] transform transition-transform duration-300"
              >
                <div className="flex justify-between items-start z-10">
                  <span className="text-[15px] md:text-[17px] font-medium text-gray-900 leading-tight whitespace-pre-line">
                    {item.title}
                  </span>

                  <a href={item.link} className="w-8 h-8 bg-[#1f2937] rounded-full flex items-center justify-center text-white transition-transform duration-300">
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="absolute bottom-0 right-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative w-full h-[500px] lg:h-auto rounded-2xl overflow-hidden group order-first lg:order-2">
            <img 
              src="https://cdn.shopify.com/s/files/1/0722/8106/3702/files/tabish.webp?v=1761999059" 
              alt="Tabish Collection" 
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-0 right-0 text-center text-white p-6">
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ProductCollections;