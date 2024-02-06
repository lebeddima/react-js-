import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import { Error } from '@/features/trade/containers/candle-chart/Error'
import { Loading } from '@/features/trade/containers/candle-chart/Loading'
import { Fullscreen } from '@/features/trade/components/Fullscreen'
import { Loader } from '@/components/loaders/Loader'
import { IntervalTab } from '@/features/trade/containers/candle-chart/IntervalTab'
import { PairInfo } from '@/features/trade/containers/candle-chart/PairInfo'
import { usePairName } from './hooks/candle-chart/use-pair-name'
import s from './styles/CandlesChart.module.scss'

const Chart = dynamic(() => import('./containers/candle-chart/Chart/Chart'), {
  ssr: false,
  loading: () => <Loader />
})

export const CandlesChart: React.FC = () => {
  const { pairName } = usePairName()
  const [fullscreen, SetFullscreen] = useState(false)

  const handleFullscrin = () => {
    SetFullscreen(!fullscreen)
  }

  const hasPairName = !!pairName.main && !!pairName.base

  return (
    <div
      className={cn(s.container, {
        [s.fullscreen]: fullscreen
      })}
    >
      <div className={s.header}>
        <IntervalTab />
        <PairInfo fullScreen={<Fullscreen onClick={handleFullscrin} />} />
      </div>

      <div className={s.mainContent}>
        <Error />
        <Loading />
        <div className={cn(s.chartCont)}>{hasPairName && <Chart />}</div>
      </div>
    </div>
  )
}
