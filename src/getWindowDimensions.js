"use client";

import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({ width: 10, height: 10 });

    useEffect(() => {
        function handleResize() {
            const { innerWidth: width, innerHeight: height } = window;
            setWindowDimensions({ width, height });
        }
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
