import { useState, useEffect } from 'react';

interface ScrollToTopButtonProps {
    scrollContainerRef: React.RefObject<HTMLDivElement>;
}

const ScrollToTopButton = ({ scrollContainerRef }: ScrollToTopButtonProps) => {
    const [visible, setVisible] = useState(false);
    const [lastScrollPos, setLastScrollPos] = useState(0);

    const checkScrollTop = () => {
        let st = scrollContainerRef.current?.scrollTop || 0;
        if (st < lastScrollPos && st > 400) { 
            if (!visible) setVisible(true);
        } else {
            if (visible) setVisible(false);
        }
        setLastScrollPos(st);
    };

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollTop);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkScrollTop);
            }
        }
    }, [scrollContainerRef]);

    return (
        <button
            onClick={scrollToTop}
            // style={{ display: visible ? 'inline' : 'none' }}
            className="fixed bottom-10 right-10 h-10 w-10 rounded-full bg-blue-500 text-white"
        >
            ↑
        </button>
    );
};

export default ScrollToTopButton;
