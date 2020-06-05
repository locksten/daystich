const plugin = require("tailwindcss/plugin")

module.exports = plugin(function ({ addUtilities, e, theme }) {
  const radiusUtilities = {}

  const { numberOfSpacings, baseSpacing } = theme("paddedRadius", {
    numberOfSpacings: 64,
    baseSpacing: theme("spacing")["1"],
  })

  Object.entries(theme("borderRadius")).forEach(([radiusKey, radiusValue]) => {
    if (parseFloat(radiusValue) !== 0)
      for (let spacing = 1; spacing <= numberOfSpacings; ++spacing) {
        radiusUtilities[`.${e(`rounded-${radiusKey}-${spacing}`)}`] = {
          borderRadius: `calc(${radiusValue} + ${spacing} * ${baseSpacing})`,
        }
        radiusUtilities[`.${e(`rounded-${radiusKey}--${spacing}`)}`] = {
          borderRadius: `calc(${radiusValue} - ${spacing} * ${baseSpacing})`,
        }
      }
  })

  addUtilities(radiusUtilities)
})
