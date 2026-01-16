const Footer = () => (
  <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <img 
          src="//zerolifestyle.co/cdn/shop/files/BLACK_LOGO.png?v=1727159839&width=150" 
          alt="Zero" 
          className="w-32 mb-4"
        />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Home</li>
          <li>Smart Watches</li>
          <li>Ear Buds</li>
          <li>Blogs</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-sm mb-4">SUPPORT</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>FAQs</li>
          <li>Track Your Order</li>
          <li>Warranty Registration</li>
          <li>Shipping Details</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-sm mb-4">POLICY</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Privacy Policy</li>
          <li>Warranty Policy</li>
          <li>Return Policy</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 mt-12">
      © 2026 Zero Lifestyle. All Rights Reserved.
    </div>
  </footer>
);

export default Footer;