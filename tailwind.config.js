module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounce: "bounce 1s infinite",
        beat: "beat 1s infinite",
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
