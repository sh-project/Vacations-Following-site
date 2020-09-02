import { useState, useEffect } from 'react';

const useResponsive = () => {
    const contentWidth = () => {
        const width = window.innerWidth;
        switch (true) {
            case (width > 1300):
                return 1200;
            case (width > 800):
                return width - 100;
            default:
                return width - 20;
        }
    }
    const [width, setWidth] = useState(contentWidth());

    useEffect(() => {
        const setWidthState = () => {
            setWidth(contentWidth());
        }

        window.addEventListener('resize', setWidthState);

        return () => {
            window.removeEventListener('resize', setWidthState);
        }
    }, []);

    return width;
}

export default useResponsive;
