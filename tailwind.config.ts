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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary-blue": "#2563EB",
        "deep-navy": "#1E3A8A",
        teal: "#14B8A6",
        purple: "#7C3AED",
        charcoal: "#111827",
        "light-gray": "#F8FAFC",
      },
    },
  },
  plugins: [],
};
export default config;
