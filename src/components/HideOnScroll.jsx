// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";

// const HideOnScroll = ({ children }) => {
//   const ref = useRef(null);
//   const isHiddenRef = useRef(false);
//   const [hidden, setHidden] = useState(false);
//   const [height, setHeight] = useState(null);
//   const [fullyHidden, setFullyHidden] = useState(false); // 完全非表示フラグ

//   useEffect(() => {
//     if (!ref.current) return;

//     setHeight(ref.current.scrollHeight); // 初回の高さを取得

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         console.log("BoundingClientRect.top:", entry.boundingClientRect.top);
//         console.log("BoundingClientRect.height:", entry.boundingClientRect.height);
//         console.log("Intersection Ratio:", entry.intersectionRatio);

//         if (entry.intersectionRatio < 0.5 && !isHiddenRef.current) {
//           console.log("Element is more than 50% hidden, setting `hidden: true`");
//           isHiddenRef.current = true;
//           setHidden(true);
//         }
//       },
//       {
//         root: null,
//         threshold: [0.5], // 50% 隠れたら発火
//         rootMargin: "-5% 0px 0px 0px",
//       }
//     );

//     observer.observe(ref.current);

//     return () => observer.unobserve(ref.current);
//   }, []);

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ height: height, opacity: 1 }}
//       animate={{ height: hidden ? 0 : height, opacity: hidden ? 0 : 1 }}
//       transition={{ height: { duration: 1.0 }, opacity: { duration: 1.0 } }}
//       className="hide-on-scroll overflow-hidden"
//       style={{ display: fullyHidden ? "none" : "block" }} // アニメーション完了後に非表示
//       onAnimationComplete={() => {
//         if (hidden) {
//           setFullyHidden(true);
//         }
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// export default HideOnScroll;
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const HideOnScroll = ({ children }) => {
  const ref = useRef(null);
  const isHiddenRef = useRef(false);
  const [hidden, setHidden] = useState(false);
  const [height, setHeight] = useState(null);
  const [canRestore, setCanRestore] = useState(false); // 戻り判定を有効化するフラグ

  useEffect(() => {
    if (!ref.current) return;

    const initialHeight = ref.current.scrollHeight;
    setHeight(initialHeight);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5 && !isHiddenRef.current) {
          isHiddenRef.current = true;
          setHidden(true);
          setCanRestore(false); // 戻り判定を一旦無効化

          // GSAPでアニメーション
          gsap.to(ref.current, {
            height: 1,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              setCanRestore(true); // アニメーション完了後に戻り判定を有効化
            }
          });
        }
      },
      {
        root: null,
        threshold: [0.5],
        rootMargin: "-5% 0px 0px 0px",
      }
    );

    observer.observe(ref.current);

    // スクロールイベントで復帰判定
    const handleScroll = () => {
      if (!ref.current || !canRestore) return;

      const boundingTop = ref.current.getBoundingClientRect().top;

      // 画面内に 1px でも入ったら復帰
      if (boundingTop >= 0 && isHiddenRef.current) {
        isHiddenRef.current = false;
        setHidden(false);

        // GSAPで復帰アニメーション
        gsap.to(ref.current, {
          height: initialHeight,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.unobserve(ref.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [canRestore]);

  return (
    <div
      ref={ref}
      className="hide-on-scroll overflow-hidden"
      style={{ minHeight: "1px" }}
    >
      {children}
    </div>
  );
};

export default HideOnScroll;
