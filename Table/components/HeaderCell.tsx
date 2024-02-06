import { isValidElement } from 'react'
import styled, { css } from 'styled-components'
import { Text } from '@/components/Text'
import { THeaderCellProps } from '../types'
import {
  ROW_PADDING_TOP,
  ROW_PADDING_BOTTOM,
  ROW_PADDING_LEFT,
  ROW_PADDING_RIGHT,
  COLUMN_GAP,
} from '../constants'

const Cell = styled.div<THeaderCellProps>(
  ({ isFirstCell, isEndCell, whiteSpace }) => css`
    padding-top: ${ROW_PADDING_TOP};
    padding-bottom: ${ROW_PADDING_BOTTOM};
    padding-left: ${isFirstCell ? ROW_PADDING_LEFT : `calc(${COLUMN_GAP} / 2)`};
    padding-right: ${isEndCell ? ROW_PADDING_RIGHT : `calc(${COLUMN_GAP} / 2)`};
    white-space: ${whiteSpace};
  `,
)

export const HeaderCell: React.FC<THeaderCellProps> = ({ children, ...props }) => {
  const isChildrenReactComponent = isValidElement(children)

  if (isChildrenReactComponent) {
    return <Cell {...props}>{children}</Cell>
  }

  return (
    <Cell {...props}>
      <Text variant="f7" color="main11">
        {children}
      </Text>
    </Cell>
  )
}
