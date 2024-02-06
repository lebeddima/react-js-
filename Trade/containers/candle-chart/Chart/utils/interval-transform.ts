import { ResolutionString } from '@/features/trade/types/tradeview'

type TIntervalTransform = (x: string) => ResolutionString

export const intervalTransform: TIntervalTransform = (string) => {
  let result = string

  if (string.includes('s')) {
    result = string.replace('s', 'S')
  }
  if (string.includes('d')) {
    result = string.replace('d', 'D')
  }
  if (string.includes('m')) {
    result = string.replace('m', '')
  }
  if (string.includes('h')) {
    result = (Number(string.replace('h', '')) * 60).toString()
  }
  if (string.includes('w')) {
    result = string.replace('w', 'W')
  }
  if (string.includes('y')) {
    result = `${(Number(string.replace('y', '')) * 12).toString()}M`
  }

  return result as ResolutionString
}
