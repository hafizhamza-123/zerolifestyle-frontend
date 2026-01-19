import { CATEGORIES } from "../data/mockData";
import { Link } from "react-router-dom";
const CategoryRow = () => {
    return (
        <section className="py-4 bg-white border-gray-100">
            <div className="max-w-[1800px] mx-auto px-4">
                <div className="flex flex-wrap justify-around md:justify-center items-start gap-2 md:gap-12">
                    {CATEGORIES.map((category, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                                <Link to={`/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="w-[60px] h-[60px] md:w-[85px] md:h-[85px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden">
                                <img
                                    src={`https:${category.img}`}
                                    alt={category.name}
                                    className="w-full h-full"
                                />
                            </div>
                            <span className="text-[10px] md:text-[14px] font-bold text-center text-black hover:text-gray-700 leading-tight tracking-wide">
                                {category.name}
                            </span>
                                </Link>
                        </div>
                            
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryRow;