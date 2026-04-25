import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(80, 240, 200, 0.22)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.18)",
      },
      backgroundImage: {
        "brand-radial": "radial-gradient(circle at top left, rgba(74, 222, 128, .24), transparent 34%), radial-gradient(circle at 80% 10%, rgba(56, 189, 248, .18), transparent 28%), linear-gradient(135deg, #07110f 0%, #0b0f19 56%, #16120b 100%)",
        "paper-radial": "radial-gradient(circle at top left, rgba(15, 118, 110, .14), transparent 34%), linear-gradient(135deg, #fbf7ec 0%, #f4efe1 52%, #ece7d8 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        sweep: "sweep 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;