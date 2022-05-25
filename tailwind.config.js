module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounce: "bounce 1s infinite",
        beat: "beat 0.3s infinite",
        scale: "scale 0.8s linear infinite",
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
        scale: {
          "0%, 100%": {
            transform: "scale(1.15)",
          },
          "50%": {
            transform: "scale(0.8)",
          },
        },
      },
    },
  },
  plugins: [],
};
