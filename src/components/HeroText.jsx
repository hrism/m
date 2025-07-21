// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// const AnimatedText = ({ text, onComplete }) => {
//   const [displayText, setDisplayText] = useState("A");

//   useEffect(() => {
//     if (text === " ") {
//       setDisplayText(" ");
//       setTimeout(onComplete, 100);
//       return;
//     }

//     let currentCharCode = "A".charCodeAt(0);
//     const targetCharCode = text.charCodeAt(0);

//     const interval = setInterval(() => {
//       if (currentCharCode >= targetCharCode) {
//         setDisplayText(text);
//         clearInterval(interval);
//         setTimeout(onComplete, 200);
//       } else {
//         setDisplayText(String.fromCharCode(currentCharCode));
//         currentCharCode++;
//       }
//     }, 50);

//     return () => clearInterval(interval);
//   }, [text, onComplete]);

//   return (
//     <motion.span
//       className="inline-block"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.2 }}
//       style={{ whiteSpace: "pre" }}
//     >
//       {displayText}
//     </motion.span>
//   );
// };

// const HeroText = ({ title, subtitle }) => {
//   const [visibleIndex, setVisibleIndex] = useState(0);
//   const [isTitleCompleted, setIsTitleCompleted] = useState(false);
//   const titleArray = title.split("");
//   const subtitleArray = subtitle.split("");

//   return (
//     <div className="absolute top-1/2 left-0 w-full text-amber-600 text-center z-20 py-8 tracking-widest mix-blend-plus-lighter font-syncopate">
//       {/* タイトル表示 */}
//       <div className="text-xl font-bold">
//         {titleArray.map((char, index) =>
//           index < visibleIndex ? (
//             <span key={index}>{char}</span>
//           ) : index === visibleIndex ? (
//             <AnimatedText
//               key={index}
//               text={char}
//               onComplete={() => {
//                 if (index + 1 === titleArray.length) {
//                   setIsTitleCompleted(true); // タイトルが完了したらサブタイトルへ
//                 }
//                 setVisibleIndex(index + 1);
//               }}
//             />
//           ) : (
//             <span key={index} style={{ visibility: "hidden" }}> </span>
//           )
//         )}
//       </div>

//       {/* タイトルが終わったらサブタイトルを表示 */}
//       {isTitleCompleted && (
//         <div className="text-base">
//           {subtitleArray.map((char, index) =>
//             index < visibleIndex - titleArray.length ? (
//               <span key={index}>{char}</span>
//             ) : index === visibleIndex - titleArray.length ? (
//               <AnimatedText
//                 key={index}
//                 text={char}
//                 onComplete={() => setVisibleIndex(index + titleArray.length + 1)}
//               />
//             ) : (
//               <span key={index} style={{ visibility: "hidden" }}> </span>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeroText;
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const animationSpeed = 10; // ← ここを変更すればアニメーションの速度を簡単に調整可能

const AnimatedText = ({ text, onComplete }) => {
    const targetCharCode = text.charCodeAt(0);
    const startCharCode = Math.max(targetCharCode - 7, 32); // 10個前の文字から開始
    const [displayText, setDisplayText] = useState(String.fromCharCode(startCharCode));
    const textRef = useRef(null);

    useEffect(() => {
        if (text === " ") {
            setDisplayText(" ");
            setTimeout(onComplete, animationSpeed);
            return;
        }

        let currentCharCode = startCharCode;

        const interval = setInterval(() => {
            if (currentCharCode >= targetCharCode) {
                setDisplayText(text); // 目標の文字に到達
                clearInterval(interval);
                setTimeout(onComplete, animationSpeed * 2); // 確定後、次の文字へ進む
            } else {
                setDisplayText(String.fromCharCode(currentCharCode));
                currentCharCode++;
            }
        }, animationSpeed); // ← アニメーションの速度をここで変更

        // GSAPでフェードインアニメーション
        if (textRef.current) {
            gsap.fromTo(textRef.current, 
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
            );
        }

        return () => clearInterval(interval);
    }, [text, onComplete]);

    return (
        <span
            ref={textRef}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
        >
            {displayText}
        </span>
    );
};

const HeroText = ({ title, subtitle }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [isTitleCompleted, setIsTitleCompleted] = useState(false);
    const titleArray = title.split("");
    const subtitleArray = subtitle.split("");

    return (
        <div className="absolute top-1/2 left-0 w-full text-amber-600 text-center z-20 py-8 tracking-widest mix-blend-plus-lighter font-syncopate translate-y-1">
            {/* タイトル表示 */}
            <div className="text-xl font-bold">
                {titleArray.map((char, index) =>
                    index < visibleIndex ? (
                        <span key={index}>{char}</span>
                    ) : index === visibleIndex ? (
                        <AnimatedText
                            key={index}
                            text={char}
                            onComplete={() => {
                                if (index + 1 === titleArray.length) {
                                    setIsTitleCompleted(true);
                                }
                                setVisibleIndex(index + 1);
                            }}
                        />
                    ) : (
                        <span key={index} style={{ visibility: "hidden" }}> </span>
                    )
                )}
            </div>

            {/* タイトルが終わったらサブタイトルを表示 */}
            {isTitleCompleted && (
                <div className="text-base">
                    {subtitleArray.map((char, index) =>
                        index < visibleIndex - titleArray.length ? (
                            <span key={index}>{char}</span>
                        ) : index === visibleIndex - titleArray.length ? (
                            <AnimatedText
                                key={index}
                                text={char}
                                onComplete={() => setVisibleIndex(index + titleArray.length + 1)}
                            />
                        ) : (
                            <span key={index} style={{ visibility: "hidden" }}> </span>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default HeroText;
