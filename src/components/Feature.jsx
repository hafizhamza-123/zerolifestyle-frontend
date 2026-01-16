import { features } from "../data/mockData.js";
const Features = () => {
    
    return (
    <section className="py-8 bg-white ">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">
        <div className="flex md:grid md:grid-cols-4 gap-y-10 gap-x-4 items-center">
          
          {features.map((feature) => (
            <div key={feature.id} className="flex-1 min-w-0 flex flex-col items-center justify-center gap-4 text-center group cursor-default px-2">
              <div className="w-18 h-18 md:w-20 md:h-20 flex items-center justify-center p-2 rounded-full bg-transparent">
                <img
                    src={feature.image.startsWith('http') ? feature.image : `https:${feature.image}`}
                    alt={feature.text}
                    className="w-full h-full object-contain"
                    loading="lazy"
                />
              </div>
              <span className="text-[11px] md:text-[13px] font-bold text-gray-800 tracking-widest uppercase">
                {feature.text}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
