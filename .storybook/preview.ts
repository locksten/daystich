/** @jsx jsx */
import { addDecorator } from "@storybook/react"
import "tailwindcss/dist/base.css"
import { Wrapper } from "./Wrapper"

addDecorator((storyFn) => Wrapper(storyFn()))
