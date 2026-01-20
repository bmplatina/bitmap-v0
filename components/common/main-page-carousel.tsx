"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  { id: 1, image: "/img1.jpg", text: "첫 번째 컬렉션" },
  { id: 2, image: "/img2.jpg", text: "두 번째 컬렉션" },
  { id: 3, image: "/img3.jpg", text: "세 번째 컬렉션" },
];

export default function AutoSliderCarousel() {
  const [index, setIndex] = useState(0);

  // 1. 자동 재생 로직
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000); // 4초마다 전환
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* 2. 사진/텍스트 영역 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          drag="x"
          initial={{ opacity: 0, x: 50 }} // 나타날 때 (오른쪽에서)
          animate={{ opacity: 1, x: 0 }} // 화면에 보일 때
          exit={{ opacity: 0, x: -50 }} // 사라질 때 (왼쪽으로)
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={slides[index].image}
            alt="collection"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <h2 className="absolute text-white text-4xl font-bold">
            {slides[index].text}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* 3. 인디케이터 영역 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
