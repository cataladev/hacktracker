import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        hind: ['Hind Siliguri', 'sans-serif'],
        chakra: ['Chakra Petch', 'sans-serif'],
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
} satisfies Config;