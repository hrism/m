/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syncopate: ["Syncopate", "sans-serif"],
      },
      animation: {
        glitch: "glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite",
        "glitch-reverse": "glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite",
        'zoom-pulse': 'zoom-pulse 2s ease-in-out infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'fade-up': 'fade-up 2.5s ease-out 1s forwards', // 1秒後に発動
        'fade-in-clear-fast': 'fade-in-clear 0.5s ease-out 0.5s forwards',
        'fade-in-clear-slow': 'fade-in-clear 1.0s ease-out 1.5s forwards',
        'slide-down-in': 'slide-down-in 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards',
      },
      keyframes: {
        "glitch-it": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        'zoom-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'shine': {
          '0%': { transform: 'translateX(-150%) translateY(-80%) rotate(45deg)', opacity: '0', filter: 'blur(6px)' },
          '10%': { opacity: '0.8', filter: 'blur(4px)' },
          '50%': { opacity: '1', filter: 'blur(2px)' },
          '80%': { opacity: '0', filter: 'blur(6px)' },
          '85%': { transform: 'translateX(150%) translateY(80%) rotate(45deg)', opacity: '0', filter: 'blur(6px)' },
          '100%': { opacity: '0', filter: 'blur(6px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(200px)' },
          '20%': { opacity: '0' },  // しばらく待機
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-clear': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
        'slide-down-in': {
          '0%': { opacity: '0', transform: 'translateY(-150%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gloss': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '50%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [
    // ▼ 追加：アニメーションを一時停止するユーティリティクラスなどを定義
    function({ addUtilities }) {
      addUtilities({
        ".animation-paused": {
          animationPlayState: "paused",
        },
      });
    },
  ],
};
