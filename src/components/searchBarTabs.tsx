
import { motion } from "framer-motion";

const tabInfo = {
  "bing": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.microsoft.com&client=chrome&size=64&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "Bing logo"
  },
  "news": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.bbc.com&client=chrome&size=64&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "News logo"
  },
  "wikipedia": {
    src: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
    alt: "Wikipedia logo"
  },
  "youtube": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.instagram.com&client=chrome&size=32&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "YouTube logo"
  },
  "images": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.instagram.com&client=chrome&size=32&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "Images logo"
  },
  "instagram": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.instagram.com&client=chrome&size=32&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "Instagram logo"
  },
  "tweets": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://twitter.com&client=chrome&size=64&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "Twitter logo"
  },
  "reddit": {
    src: "https://encrypted-tbn2.gstatic.com/faviconV2?url=https://www.reddit.com&client=chrome&size=64&type=FAVICON&fallback_opts=TYPE,SIZE,URL",
    alt: "Reddit logo"
  },
};


  interface SearchBarTabProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const SearchBarTabs: React.FC<SearchBarTabProps> = ({ activeTab, setActiveTab }) => (
    <motion.div 
      className="sticky top-0 z-20 p-4 flex items-center space-x-4 overflow-x-auto"
      layout 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {Object.entries(tabInfo).map(([key, value]) => (
        <motion.button 
          key={key} 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setActiveTab(key)}
          className={`flex items-center justify-center h-12 w-12 rounded-full ${
            activeTab === key 
              ? 'bg-indigo-500' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200'
          }`}
        >
          <img src={value.src} alt={value.alt} className="h-6 w-6" />
        </motion.button>
      ))}
    </motion.div>
  );
  
  export default SearchBarTabs;