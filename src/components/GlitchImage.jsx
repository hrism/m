import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

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
  const [currentSrc, setCurrentSrc] = useState(pcSrc);
  const [scanlines, setScanlines] = useState([]);
  
  const baseImageRef = useRef(null);
  const redImageRef = useRef(null);
  const greenImageRef = useRef(null);
  const blueImageRef = useRef(null);
  const noiseImageRef = useRef(null);
  const scanlinesRef = useRef([]);

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
      const redShift = { x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) };
      const greenShift = { x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) };
      const blueShift = { x: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT), y: getRandomValue(-GLITCH_SHIFT, GLITCH_SHIFT) };

      // 走査線をRGB合計で `SCANLINE_COUNT.min ~ SCANLINE_COUNT.max` 本生成
      setScanlines(generateScanlines());

      setGlitch(true);
      
      // GSAPでグリッチエフェクト
      const duration = getRandomValue(GLITCH_DURATION.min, GLITCH_DURATION.max) / 1000;
      
      // ベース画像を透明にする
      gsap.to(baseImageRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: "none"
      });

      // RGB画像をアニメーション
      gsap.to(redImageRef.current, {
        x: redShift.x,
        y: redShift.y,
        duration: 0.2,
        ease: "none"
      });
      
      gsap.to(greenImageRef.current, {
        x: greenShift.x,
        y: greenShift.y,
        duration: 0.2,
        ease: "none"
      });
      
      gsap.to(blueImageRef.current, {
        x: blueShift.x,
        y: blueShift.y,
        duration: 0.2,
        ease: "none"
      });

      // ノイズ画像を表示
      gsap.to(noiseImageRef.current, {
        opacity: 1,
        duration: 0.1,
        ease: "none"
      });

      // 走査線をアニメーション
      scanlinesRef.current.forEach(scanline => {
        if (scanline) {
          gsap.to(scanline, {
            opacity: 1,
            duration: 0.1,
            ease: "none"
          });
        }
      });

      setTimeout(() => {
        setGlitch(false);
        
        // 全て元に戻す
        gsap.to(baseImageRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: "none"
        });
        
        gsap.to([redImageRef.current, greenImageRef.current, blueImageRef.current], {
          x: 0,
          y: 0,
          duration: 0.1,
          ease: "none"
        });
        
        gsap.to(noiseImageRef.current, {
          opacity: 0,
          duration: 0.1,
          ease: "none"
        });

        scanlinesRef.current.forEach(scanline => {
          if (scanline) {
            gsap.to(scanline, {
              opacity: 0,
              duration: 0.1,
              ease: "none"
            });
          }
        });
      }, duration * 1000);
      
      setTimeout(glitchInterval, getRandomValue(GLITCH_INTERVAL.min, GLITCH_INTERVAL.max));
    };

    glitchInterval();
    return () => clearTimeout(glitchInterval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* ベース画像 */}
      <img
        ref={baseImageRef}
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top brightness-200"
      />

      {/* 赤ずらし */}
      <img
        ref={redImageRef}
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        style={{ filter: `drop-shadow(${SHADOW_SIZE}px 0px 0px red)` }}
      />

      {/* 緑ずらし */}
      <img
        ref={greenImageRef}
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        style={{ filter: `drop-shadow(-${SHADOW_SIZE}px 0px 0px green)` }}
      />

      {/* ブルーノイズ */}
      <img
        ref={blueImageRef}
        src={currentSrc}
        alt={alt}
        className="absolute w-full h-screen object-cover object-top opacity-90 mix-blend-screen"
        style={{ filter: `drop-shadow(0px -${SHADOW_SIZE}px 0px blue)` }}
      />

      {/* 走査線 */}
      {scanlines.map((line, index) => (
        <div
          key={index}
          ref={el => scanlinesRef.current[index] = el}
          className="absolute w-full bg-current mix-blend-screen opacity-0"
          style={{
            top: `${line.position}%`,
            height: `${line.width}px`,
            backgroundColor: line.color,
          }}
        />
      ))}

      {/* デジタルノイズ画像 */}
      <img
        ref={noiseImageRef}
        src="/img/digitalnoise3.webp"
        alt="Digital Noise"
        className="absolute w-full h-screen object-cover object-top opacity-10 mix-blend-saturation"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default GlitchImage;
