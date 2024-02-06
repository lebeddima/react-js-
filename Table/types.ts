import { CSSProperties, ReactNode } from 'react'

type TElement = ReactNode
type TRenderElement<T> = (props: T) => TElement

export type THeader<T> = {
  value: T
  label: TElement
  width?: CSSProperties['width']
}

export type TRow = {
  row: { [key: string]: TElement }
  collapse?: TElement
}

export type THeaderCellProps = {
  style: CSSProperties
  children?: TElement
  isFirstCell?: boolean
  isEndCell?: boolean
  whiteSpace?: CSSProperties['whiteSpace']
}

export type TBodyCellProps = {
  isFirstCell?: boolean
  isEndCell?: boolean
  isLastRow?: boolean
  hasCollapseRow?: boolean
  style: CSSProperties
  children?: TElement
  whiteSpace?: CSSProperties['whiteSpace']
}

export type TCollapseCellProps = {
  style: CSSProperties
  children?: TElement
  isOpen: boolean
  isLastRow: boolean
}

export type TButtonCollapseProps = {
  isOpen: boolean
  onClick: () => void
}

export type TTableProps<R, H> = {
  /**
   * `headerData` is an array of objects with `value` and `label` properties. Treat it as a table header with columns.
   *
   * Label can be a string or any valid ReactElement.
   *
   * You can also set `width` property to specify the width of the column.
   */
  headerData: H[]
  /**
   * `rowsData` is an array of objects with `row` and `collapse` properties. Treat it as a table body with rows.
   *
   * `row` is an object with keys that match the `value` property of the `headerData` object.
   *
   * `collapse` is an optional property that will be rendered in the last column of the row.
   */
  rowsData: R[]
  /**
   * Loading state of the table. Add two linear loaders to the top and bottom of the table.
   */
  loading?: boolean
  /**
   * Add empty component when nothing to show
   */
  emptyComponent?: React.ReactNode
  /**
   * For rendering table cells you can use `bodyCell` props. It is a function that returns a ReactElement.
   *
   * You can use already prepared `bodyCell` component or create your own.
   *
   * TBodyCellProps = {
   * style: CSSProperties
   * children?: TElement
   * isFirstCell?: boolean
   * isEndCell?: boolean
   * isLastRow?: boolean
   * hasCollapseRow?: boolean
   * whiteSpace?: CSSProperties['whiteSpace']
   * }
   *
   * @type (props: TBodyCellProps) => ReactElement
   *
   *
   */
  bodyCell: TRenderElement<TBodyCellProps>
  /**
   * For rendering table header cells you can use `headerCell` props. It is a function that returns a ReactElement.
   * You can use already prepared `headerCell` component or create your own.
   * THeaderCellProps = {
   * style: CSSProperties
   * children?: TElement
   * isFirstCell?: boolean
   * isEndCell?: boolean
   * whiteSpace?: CSSProperties['whiteSpace']
   * }
   *
   * @type (props: THeaderCellProps) => ReactElement
   *
   */
  headerCell: TRenderElement<THeaderCellProps>
  /**
   * For rendering table collapse cells you can use `collapseCell` props. It is a function that returns a ReactElement.
   * You can use already prepared `collapseCell` component or create your own.
   * TCollapseCellProps = {
   * style: CSSProperties
   * children?: TElement
   * isOpen: boolean
   * isLastRow: boolean
   * }
   * @type (props: TCollapseCellProps) => ReactElement
   */
  collapseCell?: TRenderElement<TCollapseCellProps>
  /**
   * For rendering table collapse button you can use `buttonCollapse` props. It is a function that returns a ReactElement.
   * You can use already prepared `buttonCollapse` component or create your own.
   * TButtonCollapseProps = {
   * isOpen: boolean
   * onClick: () => void
   * }
   * @type (props: TButtonCollapseProps) => ReactElement
   * */
  buttonCollapse?: TRenderElement<TButtonCollapseProps>
}
