// components/slider/mainPageSlider.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Slider = ({ imagePaths }) => {
    const extendedImages = [...imagePaths, imagePaths[0]];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    const startInterval = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            goToNext();
        }, 4000);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        startInterval();
    };

    useEffect(() => {
        startInterval();
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (currentIndex === imagePaths.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 500);
        }
    }, [currentIndex]);

    return (
        <div className="flex mx-auto w-full max-w-5xl h-96 overflow-hidden relative rounded-lg shadow-xl">
            <div
                className={`w-full h-full flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onClick={goToNext}
            >
                {extendedImages.map((path, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        <Image
                            src={path}
                            alt={`Slide ${index % imagePaths.length + 1}`}
                            fill
                            className="object-cover cursor-pointer"
                            quality={90}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const MainSlider = () => {
    const imagePaths = [
        '/images/about/s1.jpg',
        '/images/about/s2.jpg',
        '/images/about/s3.jpg',
        '/images/about/s4.jpg',
    ];

    return (
        <div className="my-8">
            <Slider imagePaths={imagePaths} />
        </div>
    );
};

export default MainSlider;