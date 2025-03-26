import { useEffect, useLayoutEffect, useState, useRef } from "react";

export default function HeroImage() {
    const [isSnapped, setIsSnapped] = useState(false);
    const heroRef = useRef(null);
    const [snapPoint, setSnapPoint] = useState(100); // 初期値
    const [backgroundImage, setBackgroundImage] = useState("");
    const [rightPosition, setRightPosition] = useState("20%"); // 右の位置を管理
    const [topPosition, setTopPosition] = useState("0");
    const [height, setHeight] = useState("60vh");
    const [transitionDuration, setTransitionDuration] = useState("1.5s");

    useLayoutEffect(() => {
        // 初期状態で背景画像を設定
        const updateSettings = () => {
            const isMobile = window.innerWidth <= 768; // モバイルの判定
            const baseURL = import.meta.env.ASSET_BASE_URL || ""; // 環境変数がundefinedの場合に備えてデフォルト
            console.log(isMobile)

            setSnapPoint(isMobile ? 500 : 100); // スマホなら大きな snapPoint
            setRightPosition(isMobile ? "50%" : "-10%"); // スマホ:PC
            setTopPosition(isMobile ? "-50%" : "0%");
            setHeight(isMobile ? "100vh" : "60vh");
            setTransitionDuration(isMobile ? "2s" : "5s");
            setBackgroundImage(
                isMobile
                    ? `url(${baseURL}/img/hero_mobile.jpg)` // スマホ用の画像
                    : `url(${baseURL}/img/hero.jpg)` // PC用の画像
            );
        };

        // 初回レンダリング時に背景画像設定
        updateSettings();

        // リサイズ時に背景画像更新
        window.addEventListener("resize", updateSettings);

        return () => window.removeEventListener("resize", updateSettings);
    }, []); // 初回のみ実行、リサイズ時も反応
    useLayoutEffect(() => {
        const updateSnapPoint = () => {
            const isMobile = window.innerWidth <= 768;
            setSnapPoint(isMobile ? 350 : 100);
        };

        updateSnapPoint();
        window.addEventListener("resize", updateSnapPoint);
        return () => window.removeEventListener("resize", updateSnapPoint);
    }, []);

    useEffect(() => {
        console.log("Current snapPoint:", snapPoint); // ここで snapPoint の値を確認

        const handleScroll = () => {
            if (!heroRef.current) return;
            const scrollY = window.scrollY;

            if (snapPoint && scrollY >= snapPoint && !isSnapped) {
                setIsSnapped(true);
                window.scrollTo({ top: heroRef.current.offsetTop, behavior: "smooth" });

                setTimeout(() => {
                    document.body.style.overflow = "auto";
                }, transitionDuration);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isSnapped, snapPoint]);

    useEffect(() => {
        // `isSnapped` が `true` になってから3秒後に、`#nextToFV` の `hidden` クラスを削除
        if (isSnapped) {
            const timer = setTimeout(() => {
                const nextToFV = document.getElementById("nextToFV");
                if (nextToFV) {
                    nextToFV.classList.remove("hidden");
                    nextToFV.classList.remove("opacity-0");
                }
            }, 5000); // 3秒後に実行

            return () => clearTimeout(timer); // コンポーネントがアンマウントされるときにタイマーをクリア
        }
    }, [isSnapped]); // `isSnapped` が変わるたびに実行

    return (
        <div
            id="fv"
            ref={heroRef}
            className={isSnapped ? "completed" : ""}
            style={{
                position: isSnapped ? "relative" : "fixed",
                top: isSnapped ? "0" : topPosition,
                right: isSnapped ? "50%" : rightPosition,
                transformOrigin: "top center",
                transform: isSnapped ? "translateX(50%) scale(1)" : "translateX(50%) scale(2)",
                width: isSnapped ? "100vw" : "150vw",
                height: "100vh",
                // height: isSnapped ? height : "100vh",
                filter: isSnapped ? "brightness(1.0)" : "brightness(0.2)",
                backgroundImage: backgroundImage, // 画像を反映
                backgroundSize: "cover",
                backgroundPosition: "left top",
                transition: `transform  ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), width  ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), height  ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), position  ${transitionDuration} cubic-bezier(0.25, 1, 0.5, 1), filter  ${transitionDuration} ease-out`
            }}
        />
    );
}
