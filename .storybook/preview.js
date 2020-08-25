import { AppDecorator } from "../src/storybook/AppDecorator"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [AppDecorator]
