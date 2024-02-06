import styled, { css } from 'styled-components'
import { TBodyCellProps } from '../types'
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  COLUMN_GAP,
  LAST_ROW_MARGIN,
  ROW_GAP,
  ROW_PADDING_BOTTOM,
  ROW_PADDING_LEFT,
  ROW_PADDING_RIGHT,
  ROW_PADDING_TOP,
} from '../constants'

const Cell = styled.div<TBodyCellProps>(
  ({ isFirstCell, isEndCell, isLastRow, hasCollapseRow, theme, ...props }) => {
    const BORDER = `${BORDER_WIDTH} solid ${theme.palette.main11}`

    const marginBottom =
      !hasCollapseRow &&
      css`
        margin-bottom: ${isLastRow ? LAST_ROW_MARGIN : ROW_GAP};
      `

    const borderLeft =
      isFirstCell &&
      css`
        border-top-left-radius: ${BORDER_RADIUS};
        border-bottom-left-radius: ${hasCollapseRow ? '0' : BORDER_RADIUS};
        border-left: ${BORDER};
      `

    const borderRight =
      isEndCell &&
      css`
        border-top-right-radius: ${BORDER_RADIUS};
        border-bottom-right-radius: ${hasCollapseRow ? '0' : BORDER_RADIUS};
        border-right: ${BORDER};
      `

    const padding = css`
      padding-top: ${ROW_PADDING_TOP};
      padding-bottom: ${hasCollapseRow ? '0' : ROW_PADDING_BOTTOM};
      padding-left: ${isFirstCell ? ROW_PADDING_LEFT : `calc(${COLUMN_GAP} / 2)`};
      padding-right: ${isEndCell ? ROW_PADDING_RIGHT : `calc(${COLUMN_GAP} / 2)`};
    `

    return css`
      display: flex;
      align-items: center;
      ${borderLeft}
      ${borderRight}
      ${padding}
      ${marginBottom}
      border-bottom: ${hasCollapseRow ? '0' : BORDER};
      border-top: ${BORDER};
      white-space: ${props.whiteSpace};
    `
  },
)

export const BodyCell: React.FC<TBodyCellProps> = ({ children, ...props }) => (
  <Cell {...props}>{children}</Cell>
)
