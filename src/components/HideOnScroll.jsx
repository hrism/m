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
import { motion } from "framer-motion";

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
    // console.log("Initial Height:", initialHeight);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // console.log("BoundingClientRect.top:", entry.boundingClientRect.top);
        // console.log("BoundingClientRect.height:", entry.boundingClientRect.height);
        // console.log("Intersection Ratio:", entry.intersectionRatio);
        // console.log("Current Hidden State:", isHiddenRef.current);

        if (entry.intersectionRatio < 0.5 && !isHiddenRef.current) {
          // console.log("Element is more than 50% hidden, setting `hidden: true`");
          isHiddenRef.current = true;
          setHidden(true);
          setCanRestore(false); // **戻り判定を一旦無効化**

          setTimeout(() => {
            setHeight(1);
            // console.log("Set Height to 1px");
            setTimeout(() => {
              setCanRestore(true); // **消えるアニメーション完了後に戻り判定を有効化**
            }, 500); // **アニメーションの長さと合わせる**
          }, 100);
        }
      },
      {
        root: null,
        threshold: [0.5], // **50% 隠れたら発火**
        rootMargin: "-5% 0px 0px 0px",
      }
    );

    observer.observe(ref.current);

    // **スクロールイベントで復帰判定**
    const handleScroll = () => {
      if (!ref.current || !canRestore) return; // **消えるアニメーションが完了するまで発火しない**

      const boundingTop = ref.current.getBoundingClientRect().top;

      // **画面内に 1px でも入ったら復帰**
      if (boundingTop >= 0 && isHiddenRef.current) {
        // console.log("Element has re-entered the viewport, setting `hidden: false`");
        isHiddenRef.current = false;
        setHidden(false);

        setTimeout(() => {
          if (ref.current) {
            setHeight(ref.current.scrollHeight);
          }
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.unobserve(ref.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [canRestore]); // **戻りチェックフラグを監視**

  return (
    <motion.div
      ref={ref}
      initial={{ height: height, opacity: 1 }}
      animate={{ height: hidden ? 1 : height, opacity: hidden ? 0 : 1 }}
      transition={{ height: { duration: 0.5 }, opacity: { duration: 0.3, delay: 0.1 } }}
      className="hide-on-scroll overflow-hidden"
      style={{ minHeight: "1px" }} // **監視を維持するために minHeight を適用**
    >
      {children}
    </motion.div>
  );
};

export default HideOnScroll;
