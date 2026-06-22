import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          deep: '#0e0c0a', // خلفية رئيسية
          card: '#1a1613',  // خلفية البطاقات والحقول
          border: '#2d2722', // الحدود والفواصل
        },
        gold: {
          primary: '#dfba7a', // ذهبي عيار 21 رئيسي
          hover: '#cda767',   // ذهبي هادئ للـ Hover
        },
        beige: {
          snow: '#f2e8df', // نصوص رئيسية وأسعار
          gray: '#a69584', // نصوص ثانوية وتفاصيل فرعية
        }
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
