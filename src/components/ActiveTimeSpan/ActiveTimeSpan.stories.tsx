/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Meta, Story } from "@storybook/react/types-6-0"
import { getCurrentTimestamp } from "common/time"
import { addTimeSpan } from "redux/ducks/timeSpan/timeSpan"
import { MockTagArgs } from "redux/mocking/makeMocks"
import { useReduxMocks } from "redux/mocking/mocks"
import "twin.macro"
import { ActiveTimeSpan } from "./ActiveTimeSpan"

export default {
  title: "Components/TimeSpan/ActiveTimeSpan",
  component: ActiveTimeSpan,
} as Meta

const Template: Story<
  Parameters<typeof ActiveTimeSpan>[0] & { mockTags: MockTagArgs[] }
> = ({ mockTags = [], ...args }) => {
  const { m, D } = useReduxMocks()
  const activity = m.activity({ name: "Activity" })
  D(
    addTimeSpan({
      activityId: activity,
      tagIds: mockTags.map((args) => m.tag(args)),
      startTime:
        getCurrentTimestamp() - 1000 * 60 * 60 * 3 /* TODO mock time */,
    }),
  )
  return <ActiveTimeSpan {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const WithTags = Template.bind({})
WithTags.args = {
  mockTags: [
    { name: "important", color: 18 },
    { name: "rest", color: 12 },
    { name: "health", color: 13 },
  ],
}
