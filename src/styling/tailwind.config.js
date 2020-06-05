const paddedRadiusPlugin = require("./paddedRadius")

module.exports = {
  theme: {
    extend: {},
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      default: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "1rem",
      full: "9999px",
    },
  },
  plugins: [paddedRadiusPlugin],
}
