import {
  IChartingLibraryWidget,
  ResolutionString
} from '@/features/trade/types/tradeview'

type TProps = {
  widget: IChartingLibraryWidget | null
  resolution: ResolutionString
}

type TSetResolution = (x: TProps) => Promise<string> | undefined

export const setResolution: TSetResolution = ({ widget, resolution }) => {
  if (!widget) return

  widget.activeChart().executeActionById('timeScaleReset')

  return new Promise((resolve) => {
    widget.activeChart().setResolution(resolution, () => {
      resolve('')
    })
  })
}
