/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
        // primary: {
        //   50: '#e6f2ff',
        //   500: '#1b87e6',
        //   900: '#1b3380',
        // },
      },
      fontFamily: {
        // Add custom fonts here
        // sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Add custom spacing here
        // '18': '4.5rem',
      },
      animation: {
        // Add custom animations here
        // 'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        // Add custom keyframes here
        // fadeIn: {
        //   '0%': { opacity: '0' },
        //   '100%': { opacity: '1' },
        // }
      },
    },
  },
  plugins: [
    // Add Tailwind plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
