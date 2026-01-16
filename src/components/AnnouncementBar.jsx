import { ChevronRight } from 'lucide-react';

const AnnouncementBar = () => (
    <div className="bg-[#05076f] text-white text-xs md:text-sm py-2 px-4 flex justify-center items-center gap-2 font-semibold">
        <p>Code: "500" for Extra 500 Rs off</p>
        <a href="#" className="flex items-center text-[#ffb700] underline underline-offset-2 hover:text-[#f9da8d]">
            Apply Now <ChevronRight size={14} />
        </a>
    </div>
);

export default AnnouncementBar;