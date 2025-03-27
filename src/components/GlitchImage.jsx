import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 設定可能な変数
const GLITCH_SHIFT = 50; // RGBの最大ズレ幅（px）
const SHADOW_SIZE = 100; // 影の大きさ（px）
const GLITCH_DURATION = { min: 100, max: 300 }; // グリッチの持続時間（ms）
const GLITCH_INTERVAL = { min: 1500, max: 4500 }; // グリッチの発生間隔（ms）
const SCANLINE_COUNT = { min: 1, max: 5 }; // 走査線の本数（ランダム・全RGB合計）
const SCANLINE_WIDTH = { min: 1, max: 100 }; // 走査線の太さ（ランダム）

const getRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateScanlines = () => {
  const totalLines = getRandomValue(SCANLINE_COUNT.min, SCANLINE_COUNT.max);
  const colors = ["red", "green", "blue"];
  return Array.from({ length: totalLines }, () => ({
    position: getRandomValue(0, 100), // 0%〜100%のランダムな位置
    width: getRandomValue(SCANLINE_WIDTH.min, SCANLINE_WIDTH.max), // ランダムな太さ
    color: colors[getRandomValue(0, colors.length - 1)], // RGBのどれかを選択
  }));
};

const GlitchImage = ({ pcSrc, mobileSrc, alt }) => {
  const [glitch, setGlitch] = useState(false);
  const [redShift, setRedShift] = useState({ x: 0, y: 0 });
  const [greenShift, setGreenShift] = useState({ x: 0, y: 0 });
  const [blueShift, setBlueShift] = useState({ x: 0, y: 0 });
  const [currentSrc, setCurrentSrc] = useState(pcSrc);
  const [scanlines, setScanlines] = useState([]);

  useEffect(() => {
    const updateSrc = () => {
      setCurrentSrc(window.matchMedia("(max-width: 768px)").matches ? mobileSrc : pcSrc);
    };

    updateSrc();
    window.addEventListener("resize", updateSrc);
    return () => window.removeEventListener("resize", updateSrc);
  }, [pcSrc, mobileSrc]);

  useEffect(() => {
    const glitchInterval = () => {
      setRedShift({ x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) });
      setGreenShift({ x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) });
      setBlueShift({ x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) });

      // 走査線をRGB合計で `SCANLINE_COUNT.min ~ SCANLINE_COUNT.max` 本生成
      setScanlines(generateScanlines());

      setGlitch(true);
      setTimeout(() => setGlitch(false), getRandomValue(GLITCH_DURATION.min, GLITCH_DURATION.max));
      setTimeout(glitchInterval, getRandomValue(GLITCH_INTERVAL.min, GLITCH_INTERVAL.max));
    };

    glitchInterval();
    return () => clearTimeout(glitchInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* ベース画像（グリッチ中は透明にする） */}
      <motion.img
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top brightness-200"
        animate={{ opacity: glitch ? 0 : 1 }}
        transition={{ duration: 0.1, ease: "linear" }}
      />

      {/* 赤ずらし */}
      <motion.img
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        animate={glitch ? { x: redShift.x, y: redShift.y } : { x: 0, y: 0 }}
        transition={{ duration: glitch ? 0.2 : 0 }}
        style={{ filter: `drop-shadow(${SHADOW_SIZE}px 0px 0px red)` }}
      />

      {/* 緑ずらし */}
      <motion.img
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        animate={glitch ? { x: greenShift.x, y: greenShift.y } : { x: 0, y: 0 }}
        transition={{ duration: glitch ? 0.2 : 0 }}
        style={{ filter: `drop-shadow(-${SHADOW_SIZE}px 0px 0px green)` }}
      />

      {/* ブルーノイズ */}
      <motion.img
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        animate={glitch ? { x: blueShift.x, y: blueShift.y } : { x: 0, y: 0 }}
        transition={{ duration: glitch ? 0.2 : 0 }}
        style={{ filter: `drop-shadow(0px -${SHADOW_SIZE}px 0px blue)` }}
      />

      {/* 走査線（グリッチ中のみ表示） */}
      {scanlines.map((line, index) => (
        <motion.div
          key={index}
          className="absolute w-full bg-current mix-blend-screen"
          style={{
            top: `${line.position}%`,
            height: `${line.width}px`,
            backgroundColor: line.color,
          }}
          animate={{ opacity: glitch ? 1 : 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      ))}

      {/* デジタルノイズ画像（グリッチ中のみ表示） */}
      <motion.img
        src="/img/digitalnoise3.webp"
        alt="Digital Noise"
        className="absolute w-full h-screen object-cover object-top opacity-10 mix-blend-saturation"
        animate={{ opacity: glitch ? 1 : 0 }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
};

export default GlitchImage;
