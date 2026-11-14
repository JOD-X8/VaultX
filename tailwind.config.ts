import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          red: "#FF1744",
        },
        primary: {
          red: "#E6002E",
        },
        deep: {
          red: "#A50021",
        },
        soft: {
          red: "#FFF5F6",
          50: "#FFF9FA",
          100: "#FFEBF0",
        },
        light: {
          border: "#FFD5DC",
        },
        text: {
          main: "#202020",
          secondary: "#777777",
        },
      },
      boxShadow: {
        "neon-sm": "0 2px 10px rgba(255, 23, 68, 0.18)",
        "neon-md": "0 4px 20px rgba(255, 23, 68, 0.28)",
        "neon-lg": "0 8px 30px rgba(255, 23, 68, 0.32)",
        "soft-card": "0 2px 14px rgba(230, 0, 46, 0.05)",
        "soft-hover": "0 8px 24px rgba(230, 0, 46, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
