import { Link } from 'react-router-dom'; 

const PromoVideo = () => {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8">

        <div className="w-full overflow-hidden">

          <Link to="/sale" className="block w-full">
            <video 
              className="w-full h-auto block" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="https://cdn.shopify.com/videos/c/o/v/cfb1442d1d1d4c4ca889bd1d7c09abe8.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </Link>
          
        </div>

      </div>
    </section>
  );
};

export default PromoVideo;