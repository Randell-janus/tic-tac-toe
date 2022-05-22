module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounce: "bounce 0.5s infinite",
        beat: "beat 0.5s infinite",
      },
      keyframes: {
        beat: {
          "0%, 100%": {
            transform: "scale(1.05)",
          },
          "50%": {
            transform: "scale(1.0)",
          },
        },
      },
    },
  },
  plugins: [],
};
