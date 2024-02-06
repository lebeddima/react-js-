import React, { Fragment, useState } from 'react'
import { THeader, TRow, TTableProps } from './types'
import * as S from './Table.styled'
import { HorizontallScroll } from '../HorizontalScroll'
import { InlineLoader } from '../loaders/InlineLoader'

type TRenderRow = {
  rowData: TRow['row']
  collapseData: TRow['collapse']
  rowIndex: number
  isLastRow: boolean
}

export function Table<R extends TRow, H extends THeader<keyof R['row']>>({
  rowsData = [],
  headerData,
  loading,
  bodyCell,
  headerCell,
  collapseCell,
  buttonCollapse,
  emptyComponent,
}: TTableProps<R, H>): JSX.Element | null {
  const [open, setOpen] = useState<(string | number)[]>([])

  const isEmpty = rowsData.length === 0
  const isFallback = isEmpty && !!emptyComponent
  const hasCollapse = !!collapseCell && !!buttonCollapse

  const onClickFolding = (id: number) => {
    if (open.includes(id)) {
      setOpen(open.filter((item) => item !== id))
      return
    }
    setOpen([...open, id])
  }

  const renderHeader = () => (
    <>
      {headerData.map((headerItem, cellIndex) => {
        const isFirstCell = cellIndex === 0
        const isEndCell = !hasCollapse && cellIndex === headerData.length - 1

        return (
          <Fragment key={headerItem.value as string}>
            {headerCell({
              isFirstCell,
              isEndCell,
              style: {
                gridColumn: `${cellIndex + 1} / ${cellIndex + 2}`,
                gridRow: '1 / 2',
              },
              children: headerItem.label,
            })}
          </Fragment>
        )
      })}
      {hasCollapse &&
        headerCell({
          isEndCell: true,
          style: {
            gridColumn: `${headerData.length + 1} / ${headerData.length + 2}`,
          },
        })}
    </>
  )

  const renderRow = ({ rowIndex, rowData, collapseData, isLastRow }: TRenderRow) => {
    const id = rowData.id as number
    const isOpen = open.includes(id)

    return (
      <>
        {headerData.map((headerItem, cellIndex) => {
          const isFirstCell = cellIndex === 0
          const isEndCell = !hasCollapse && cellIndex === headerData.length - 1

          return (
            <Fragment key={headerItem.value as string}>
              {bodyCell({
                children: rowData[headerItem.value],
                isFirstCell,
                isEndCell,
                hasCollapseRow: hasCollapse,
                isLastRow,
                style: {
                  gridColumn: `${cellIndex + 1} / ${cellIndex + 2}`,
                  gridRow: `${rowIndex} / ${rowIndex + 1}`,
                },
              })}
            </Fragment>
          )
        })}
        {hasCollapse &&
          bodyCell({
            children: buttonCollapse({ isOpen, onClick: () => onClickFolding(id) }),
            isEndCell: true,
            isLastRow,
            hasCollapseRow: hasCollapse,
            style: {
              gridColumn: `${headerData.length + 1} / ${headerData.length + 2}`,
              gridRow: `${rowIndex} / ${rowIndex + 1}`,
            },
          })}

        {hasCollapse &&
          collapseCell({
            isOpen,
            children: collapseData,
            isLastRow,
            style: {
              gridColumn: `1 / ${headerData.length + 2}`,
              gridRow: `${rowIndex + 1} / ${rowIndex + 2}`,
            },
          })}
      </>
    )
  }

  const renderRows = () =>
    rowsData.map((rowData, index) => {
      const { row, collapse } = rowData
      const rowIndex = rowsData.length === 0 ? index + 1 : (index + 1) * 2

      const isLastRow = index + 1 === rowsData.length

      return (
        <Fragment key={`${row.id}`}>
          {renderRow({
            rowIndex: rowIndex + 1,
            rowData: row,
            collapseData: collapse,
            isLastRow,
          })}
        </Fragment>
      )
    })

  const gridTemplateColumns = [
    ...headerData.map(({ width }) => (width ? `minmax(${width}, auto)` : 'auto')),
    ...[hasCollapse ? 'min-content' : ''],
  ].join(' ')

  return (
    <HorizontallScroll hideScrollbars={Boolean(loading)}>
      <InlineLoader loading={loading} borderRadius={4} />
      <S.Table gridTemplateColumns={gridTemplateColumns}>
        {renderHeader()}
        {!isFallback && renderRows()}
        {isFallback && emptyComponent}
      </S.Table>
      <InlineLoader loading={loading} borderRadius={4} />
    </HorizontallScroll>
  )
}
