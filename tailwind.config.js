/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        82: '328px',
      },
      borderRadius: {
        10: '10px',
        16: '16px',
      },
      colors: {
        // Main Color
        brand: '#FF5555',
        default: '#2F2F2F',

        // Sub Color (카테고리별)
        delivery: '#FF7376', // 배달음식
        cafe: '#FF9595', // 카페
        shopping: '#FFA66F', // 쇼핑
        taxi: '#FFC457', // 택시
        convenience: '#FFE7AC', // 편의점
        culture: '#CDE897', // 문화
        transport: '#72E39C', // 대중교통
        medical: '#8CC2FF', // 의료
        life: '#8F95EC', // 생활
        etc: '#CF8FEC', // 그외
        income: '#C9C9C9', // 수입

        // Gray Scale
        'gray-1': '#414141',
        'gray-2': '#626262',
        'gray-3': '#A1A1A1',
        'gray-4': '#C9C9C9',
        'gray-5': '#F1F1F1',
      },
      fontFamily: {
        'anton-sc': ['Anton SC', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
