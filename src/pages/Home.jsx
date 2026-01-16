import AnnouncementBar from '../components/AnnouncementBar.jsx';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import CategoryRow from '../components/CategoryRow.jsx';
import Footer from '../components/Footer.jsx';
import PromoVideo from '../components/PromoVideo.jsx';
import ProductsSection from '../components/product/ProductsSection.jsx';
import BestSeller from '../components/product/BestSeller.jsx';
import Features from '../components/Feature.jsx';
import JustLaunched from '../components/product/JustLaunched.jsx';
import FeaturedCollections from '../components/FeaturedCollections.jsx';
import ProductCollections from '../components/ProductCollections.jsx';
import FeaturedLaunches from '../components/FeaturedLaunches.jsx';
import ZerosPromise from '../components/ZerosPromise.jsx';
import RecentCollabs from '../components/RecentCollabs.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      
      <AnnouncementBar />
      <Navbar />
      <Hero />
        <CategoryRow />
        <PromoVideo />
        <ProductsSection />
        <BestSeller />
        <Features />
        <JustLaunched />
        <FeaturedCollections />
        <ProductCollections />
        <FeaturedLaunches />
        <RecentCollabs />
        <ZerosPromise />
        <Footer />
    </div>
  );
};

export default Home;