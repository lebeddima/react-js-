import styled, { css } from 'styled-components'
import { Collapse } from 'react-collapse'
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  ROW_PADDING_BOTTOM,
  COLLAPSE_TIME,
  LAST_ROW_MARGIN,
  ROW_GAP,
} from '../constants'
import { TCollapseCellProps } from '../types'

const Cell = styled.div<Pick<TCollapseCellProps, 'isLastRow'>>(
  ({ isLastRow }) => css`
    margin-bottom: ${isLastRow ? LAST_ROW_MARGIN : ROW_GAP};

    & .ReactCollapse--collapse {
      transition: height ${COLLAPSE_TIME};
    }
  `,
)

const Content = styled.div(({ theme }) => {
  const BORDER = `${BORDER_WIDTH} solid ${theme.palette.main11}`

  return css`
    border-left: ${BORDER};
    border-right: ${BORDER};
    padding: 0 24px;
    padding-top: 12px;
  `
})

const Border = styled.div(({ theme }) => {
  const BORDER = `${BORDER_WIDTH} solid ${theme.palette.main11}`

  return css`
    height: ${ROW_PADDING_BOTTOM};
    border-left: ${BORDER};
    border-right: ${BORDER};
    border-bottom: ${BORDER};
    border-bottom-left-radius: ${BORDER_RADIUS};
    border-bottom-right-radius: ${BORDER_RADIUS};
  `
})

export const CollapseCell: React.FC<TCollapseCellProps> = ({
  children,
  isOpen,
  isLastRow,
  style,
}) => (
  <Cell style={style} isLastRow={isLastRow}>
    <Collapse isOpened={isOpen}>
      <Content>{children}</Content>
    </Collapse>
    <Border />
  </Cell>
)
