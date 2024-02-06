import { IChartingLibraryWidget } from '@/features/trade/types/tradeview'

type TProps = {
  widget: IChartingLibraryWidget | null
  symbol: string
}

type TSetSymbol = (x: TProps) => Promise<string> | undefined

export const setSymbol: TSetSymbol = ({ widget, symbol }) => {
  if (!widget) return

  widget.activeChart().executeActionById('timeScaleReset')

  return new Promise((resolve) => {
    widget.activeChart().setSymbol(symbol, () => {
      resolve('')
    })
  })
}
