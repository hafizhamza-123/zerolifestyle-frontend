import p1 from '../assets/images/Artboard_1.jpg';
import p2 from '../assets/images/Artboard_1_copy_2.jpg';
import p3 from '../assets/images/Artboard_1_copy.jpg';
import p4 from '../assets/images/Artboard_1_copy_3.jpg';



const CATEGORIES = [
  {
    name: "Smart Watches",
    img: "//zerolifestyle.co/cdn/shop/files/smartwatches_2_85x85.webp?v=1758197934"
  },
  {
    name: "New Launch",
    img: "//zerolifestyle.co/cdn/shop/files/new-launch_85x85.webp?v=1758197934"
  },
  {
    name: "11.11 SALE",
    img: "//zerolifestyle.co/cdn/shop/files/circle_copy_2_85x85.webp?v=1761935369"
  },
  {
    name: "Headphone",
    img: "//zerolifestyle.co/cdn/shop/files/headphone_85x85.webp?v=1758197934"
  },
  {
    name: "Earbuds",
    img: "//zerolifestyle.co/cdn/shop/files/earbuds_d67c1f20-fbeb-4e47-abf2-fb78889efa40_85x85.webp?v=1758197934"
  }
];

const features = [
  {
    id: 1,
    image: "//zerolifestyle.co/cdn/shop/files/Asset_3.svg?v=1742209550&width=80",
    text: "1 Year Warranty"
  },
  {
    id: 2,
    image: "//zerolifestyle.co/cdn/shop/files/Asset_5.svg?v=1742209550&width=100",
    text: "7 Days Replacement",
  },
  {
    id: 3,
    image: "//zerolifestyle.co/cdn/shop/files/Asset_4.svg?v=1742209549&width=140",
    text: "Free Delivery",
  },
  {
    id: 4,
    image: "//zerolifestyle.co/cdn/shop/files/Asset_2.svg?v=1742209549&width=100",
    text: "1,000,000+ Customers",
  },
];

const collections = [
    {
      id: 1,
      title: "For Fashion",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/regal_bg.jpg?v=1739884653",
      link: "/collections/fashion"
    },
    {
      id: 2,
      title: "For Adventure",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Smartwatch-Category-Banner_02.webp?v=1732355317",
      link: "/collections/adventure"
    },
    {
      id: 3,
      title: "For your\nLifestyle",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Smartwatch-Category-Banner_04.webp?v=1732355316",
      link: "/collections/lifestyle"
    },
    {
      id: 4,
      title: "For Productivity",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Smartwatch-Category-Banner_03.webp?v=1732355316",
      link: "/collections/productivity"
    },

  ];

const collections1 = [
    {
      id: 1,
      title: "For the Gamers",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Earbuds-Category-Banner_01.webp?v=1732355316",
      link: "/products/arcade-series"
    },
    {
      id: 2,
      title: "For the Productivity Pros",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Earbuds-Category-Banner_02.webp?v=1732355316",
      link: "/products/wave-earbuds"
    },
    {
      id: 3,
      title: "For the\nAudio Enthusiasts",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/Robo_bg.jpg?v=1739884654",
      link: "/products/audio-enthusiasts"
    },
    {
      id: 4,
      title: "For the\nFocused Listeners",
      image: "https://cdn.shopify.com/s/files/1/0722/8106/3702/files/New-Website-Earbuds-Category-Banner_04.webp?v=1732355316",
      link: "/products/focused-listeners"
    },
    
  ];

export const FEATURED_LAUNCHES = [
  {
    id: 1,
    title: "Striker",
    subtitle: "Tribute to the Army",
    tags: ["AI ENx", "90 Days Standby", "Aggressive Indicators"],
    activeTagIndex: 2, // Which tag is highlighted black
    image: "https://zerolifestyle.co/cdn/shop/files/ad_01.webp?v=1750342345",
    footerText: "Worth to Buy",
    stats: { sold: "5k+", wishlist: "4k+", trending: true }
  },
  {
    id: 2,
    title: "Orbit 2",
    subtitle: "Style in Every Second",
    tags: ["360 Experience", "15 Days Standby", "1.38 Wide Display"],
    activeTagIndex: 0,
    image: "https://zerolifestyle.co/cdn/shop/files/orbit.jpg?v=1750341937",
    footerText: "Pre-Order Now",
    stats: { sold: "1.5k+", wishlist: "1.4k+", trending: false }
  },
  {
    id: 3,
    title: "Storm ® by Zero",
    subtitle: "Fawad's Recommended",
    tags: ["Balanced Audio", "70 Hour Playtime", "40mm Driver"],
    activeTagIndex: 1,
    image: "https://zerolifestyle.co/cdn/shop/files/storm-fawad.png?v=1750331877",
    footerText: "Zero's Limited Edition",
    stats: { sold: "4.5k+", wishlist: "3.4k+", trending: true }
  }
];

export const PROMISE_IMAGES = [
  {
    id: 1,
    image: p1,
    title: "No Questions Asked Returns",
    link: "/returns"
  },
  {
    id: 2,
    image: p2,
    title: "Easy 7 Days Replacement",
    link: "/replacement"
  },
  {
    id: 3,
    image: p3,
    title: "FREE Shipping",
    link: "/shipping"
  },
  {
    id: 4,
    image: p4,
    title: "Easy Warranty Claim",
    link: "/warranty"
  }
];

export const RECENT_COLLABS = [
  {
    id: 1,
    name: "Regal AI",
    video: "https://cdn.shopify.com/videos/c/o/v/0c8d613003724b8686042f335726feef.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/ad_03_2.jpg?v=1750424623",
    link: "/products/regal-smartwatch"
  },
  {
    id: 2,
    name: "Revoltt Pro",
    video: "https://cdn.shopify.com/videos/c/o/v/0914bbf7d893469b8389aa76f0a1b4a5.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/9.jpg?v=1750424571",
    link: "/products/revoltt-pro-smartwatch"
  },
  {
    id: 3,
    name: "Wave Pro",
    video: "https://cdn.shopify.com/videos/c/o/v/18fb1ebc99bb42fcbf93a86bc84ca236.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/creative_2_-_battery.jpg?v=1750424540",
    link: "/products/wave-pro"
  },
  {
    id: 4,
    name: "Arcade 800",
    video: "https://cdn.shopify.com/videos/c/o/v/62767d51ca9a44f18ca56ed8c9c0f429.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/arcade-1.jpg?v=1750424594",
    link: "/products/arcade-800"
  },
  {
    id: 5,
    name: "Crown",
    video: "https://cdn.shopify.com/videos/c/o/v/689ac16e3b784deaa3671a6a64d4b81e.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/Ad-01.webp?v=1750489939",
    link: "/products/crown-smartwatch"
  },
  {
    id: 6,
    name: "Z811",
    video: "https://cdn.shopify.com/videos/c/o/v/a26243e404324a45aa8cc5f71310678a.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/811-Black-ER.jpg?v=1733301032",
    link: "/products/z811-earbuds"
  },
  {
    id: 7,
    name: "Vogue",
    video: "https://cdn.shopify.com/videos/c/o/v/8400f2144f8444369b27cf068d982914.mp4",
    poster: "https://zerolifestyle.co/cdn/shop/files/Vogue_Banner_Mob_Upd.webp?v=1722248238",
    link: "/products/vogue-smartwatch"
  }
];

export { CATEGORIES };
export { features };
export { collections };
export { collections1 };