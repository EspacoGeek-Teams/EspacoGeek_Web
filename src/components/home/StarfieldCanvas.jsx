'use client';

import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return undefined;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return undefined;
        }

        let animationFrameId = 0;
        let stars = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createStars = (count) => {
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * 1000,
                size: Math.random() * 1.5 + 0.5,
            }));
        };

        const handleResize = () => {
            resize();
            createStars(400);
        };

        const animate = () => {
            context.fillStyle = 'rgba(10, 12, 20, 0.15)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (const star of stars) {
                star.z -= 0.3;

                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - centerX;
                    star.y = Math.random() * canvas.height - centerY;
                    star.z = 1000;
                }

                const starX = (star.x / star.z) * 300 + centerX;
                const starY = (star.y / star.z) * 300 + centerY;
                const size = (1 - star.z / 1000) * star.size * 2;
                const opacity = 1 - star.z / 1000;

                context.beginPath();
                context.arc(starX, starY, size, 0, Math.PI * 2);
                context.fillStyle = `rgba(180, 230, 255, ${opacity * 0.8})`;
                context.fill();
            }

            animationFrameId = window.requestAnimationFrame(animate);
        };

        handleResize();
        animate();
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 z-0"
        />
    );
}