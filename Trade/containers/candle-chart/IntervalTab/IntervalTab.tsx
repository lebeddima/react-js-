// import useTranslation from 'next-translate/useTranslation'
import { useLoading } from '@/features/trade/hooks/candle-chart/use-loading'
import { ButtonText } from '@/components/buttons/ButtonText'
import { useInterval } from '@/features/trade/hooks/candle-chart/use-interval'
import s from './IntervalTab.module.scss'

export const IntervalTab: React.FC = () => {
  const { currentInterval, intervals, setInterval } = useInterval()
  const { loading } = useLoading()

  const intervalArray = Object.keys(intervals)

  if (!intervalArray.length) return null

  return (
    <div id="interval" className={s.container}>
      {intervals.map((item) => (
        <ButtonText
          id={item.interval}
          key={item.interval}
          label={item.interval}
          theme="nav-shift"
          additionalState={currentInterval.interval === item.interval}
          notActive={loading}
          onClick={() => setInterval(item)}
        />
      ))}
    </div>
  )
}
