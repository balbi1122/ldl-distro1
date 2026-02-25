// [build] library: 'shadcn'
import DatePickerWithRange from "../components/ui/date-picker-with-range";

const meta = {
  title: "ui/DatePickerWithRange",
  component: DatePickerWithRange,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: (args: any) => <DatePickerWithRange {...args} />,
  args: {},
};

export const WithClassName = {
  render: (args: any) => <DatePickerWithRange {...args} />,
  args: {
    className: "w-full",
  },
};
