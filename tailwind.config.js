/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        82: "328px",
      },
      borderRadius: {
        10: "10px",
        16: "16px",
      },
      colors: {
        "gray-c9": "#c9c9c9",
        "kakao-yellow": "#fee500",
        "dark-gray": "#333",
        "light-gray-db": "#dbdbdb",
        "dark-bg": "#2f2f2f",
        "primary-red": "#ff5555",
        "card-bg": "#414141",
      },
      fontFamily: {
        "anton-sc": ["Anton SC", "sans-serif"],
        pretendard: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
