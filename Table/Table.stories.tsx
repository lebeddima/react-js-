/* eslint-disable i18next/no-literal-string */
import { StoryObj, Meta } from '@storybook/react'

import { ArrowIcon } from '@/icons/Arrow'
import { Table } from './Table'
import { Text } from '../Text'
import { BodyCell } from './components/BodyCell'
import { HeaderCell } from './components/HeaderCell'
import { CollapseCell } from './components/CollapseCell'
import { IconButton } from '../buttons/IconButton'

/**
 * This is a simple table component. Without sorting, pagination, etc.
 *
 * You mast pass `headerData` and `rowsData` to the table.
 *
 * `headerData` is an array of objects with `value` and `label` properties. Treat it as a table header with columns.
 *
 * `rowsData` is an array of objects with `row` and `collapse` properties.
 *
 * Each row object `value` matches the `headerData` object value.
 *
 * See examples with code on this page to better understand how to use this component.
 *
 * For rendering table cells you can use `bodyCell` and `headerCell` props.
 *
 * We have already provide those components for you. But you can override them if you need.
 *
 * See examples with code on this page to better understand how to use this component.
 */
const meta: Meta<typeof Table> = {
  title: 'Data display/Table',
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes,
}

export default meta
type Story = StoryObj<typeof Table>

const headerData = [
  {
    value: 'date',
    label: <Text variant="f6">Date</Text>,
  },
  {
    value: 'amount',
    label: 'Amount',
  },
  {
    value: 'commission',
    label: 'Commission',
  },
  {
    value: 'coin',
    label: 'Coin',
  },
  {
    value: 'type',
    label: 'Types',
  },
  {
    value: 'status',
    label: 'Status',
  },
]

const rowsData = [1, 2, 3].map(() => ({
  row: {
    id: Math.random().toString(),
    date: <Text variant="f7">Date</Text>,
    amount: <Text variant="f7">Item amount</Text>,
    commission: <Text variant="f7">Item fee</Text>,
    coin: <Text variant="f7">Item coin</Text>,
    type: <Text variant="f7">Item type</Text>,
    status: <Text variant="f7">Status</Text>,
  },
}))

export const Default: Story = {
  args: {
    headerData,
    rowsData,
    bodyCell: (props) => <BodyCell {...props} whiteSpace="nowrap" />,
    headerCell: (props) => <HeaderCell {...props} whiteSpace="nowrap" />,
  },
}

export const WithLoading: Story = {
  args: {
    loading: true,
    headerData,
    rowsData,
    bodyCell: (props) => <BodyCell {...props} whiteSpace="nowrap" />,
    headerCell: (props) => <HeaderCell {...props} whiteSpace="nowrap" />,
  },
}

/**
 * You can set width for each column in headerData by specifing width property
 */
export const WithColumnWidth: Story = {
  args: {
    rowsData,
    headerData: [
      {
        value: 'date',
        width: '400px',
        label: <Text variant="f6">Date</Text>,
      },
      {
        value: 'amount',
        label: 'Amount',
      },
      {
        value: 'commission',
        label: 'Commission',
      },
      {
        value: 'coin',
        label: 'Coin',
      },
      {
        value: 'type',
        label: 'Types',
      },
      {
        value: 'status',
        label: 'Status',
      },
    ],
    bodyCell: (props) => <BodyCell {...props} whiteSpace="nowrap" />,
    headerCell: (props) => <HeaderCell {...props} whiteSpace="nowrap" />,
  },
}

/**
 * Sometimes you need to render some additional data for the row.
 * You can do it by passing collapseCell and buttonCollapse props.
 * buttonCollapse is a function that returns a button that will be rendered in the last column of the table.
 * collapseCell is a function that returns a component that will be rendered under the row.
 * Content of the collapseCell created in collapse property for rowsData.
 */
export const WithCollapseItems: Story = {
  args: {
    rowsData: [1, 2, 3].map((index) => ({
      row: {
        id: Math.random().toString(),
        date: <Text variant="f7">Date</Text>,
        amount: <Text variant="f7">Item amount</Text>,
        commission: <Text variant="f7">Item fee</Text>,
        coin: <Text variant="f7">Item coin</Text>,
        type: <Text variant="f7">Item type</Text>,
        status: <Text variant="f7">Status</Text>,
      },
      collapse: <Text>Collapse Data for {index} row</Text>,
    })),
    headerData: [
      {
        value: 'date',
        width: '400px',
        label: <Text variant="f6">Date</Text>,
      },
      {
        value: 'amount',
        label: 'Amount',
      },
      {
        value: 'commission',
        label: 'Commission',
      },
      {
        value: 'coin',
        label: 'Coin',
      },
      {
        value: 'type',
        label: 'Types',
      },
      {
        value: 'status',
        label: 'Status',
      },
    ],
    bodyCell: (props) => <BodyCell {...props} whiteSpace="nowrap" />,
    headerCell: (props) => <HeaderCell {...props} whiteSpace="nowrap" />,
    collapseCell: (props) => <CollapseCell {...props} />,
    buttonCollapse: ({ isOpen, onClick }) => (
      <IconButton onClick={onClick}>
        <ArrowIcon direction={isOpen ? 'down' : 'up'} />
      </IconButton>
    ),
  },
}
