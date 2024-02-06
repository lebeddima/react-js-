import React, { useEffect, useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import { useRouter } from 'next/router'
import { joinPair } from '@/utils/join-pair'
import { useLoading } from '@/features/trade/hooks/candle-chart/use-loading'
import {
  GetLocaleString,
  IChartingLibraryWidget,
  ChartingLibraryWidgetOptions
} from '@/features/trade/types/tradeview'
import { reInit } from '@/features/trade/store/candle-chart'
import { useRedux } from '@/hooks/useRedux'
import { useError } from '@/features/trade/hooks/candle-chart/use-error'
import { useInterval } from '@/features/trade/hooks/candle-chart/use-interval'
import { usePairName } from '@/features/trade/hooks/candle-chart/use-pair-name'
import { EColorTheme } from '@/types/color-theme'
import { ThemeState } from 'theme/themeContextWrapper'
import { setResolution } from './utils/set-resolution'
import { setSymbol } from './utils/set-symbol'
import s from './Chart.module.scss'
import { widget as Widget } from '../../../../../../public/charting_library'
import { datafeed } from './utils/data-feed'
import { intervalTransform } from './utils/interval-transform'
import { getTimeZone } from './utils/time-zone'

const getLocaleString: GetLocaleString = (locale) => locale

const GREEN = getComputedStyle(document.documentElement)
  .getPropertyValue('--green')
  .trim()

const RED = getComputedStyle(document.documentElement).getPropertyValue('--error').trim()

const Chart: React.FC = () => {
  const [, dispatch] = useRedux()
  const router = useRouter()
  const widgetInst = useRef<IChartingLibraryWidget | null>(null)

  const { pairName } = usePairName()
  const { currentInterval } = useInterval()
  const { setError } = useError()
  const { loading } = useLoading()
  const { theme } = ThemeState()

  // change intrval
  useUpdateEffect(() => {
    const widget = widgetInst.current

    if (!widget) return

    const set = async () => {
      try {
        await setResolution({
          widget,
          resolution: intervalTransform(currentInterval.interval)
        })
      } catch (e) {
        setError('error-load')
      }
    }

    set()
  }, [currentInterval])

  // change symbol
  useUpdateEffect(() => {
    const widget = widgetInst.current

    if (!widget) return

    if (loading) {
      dispatch(reInit())
      return
    }

    const set = async () => {
      try {
        await setSymbol({ widget, symbol: joinPair({ pairName, separator: 'layout' }) })
      } catch (e) {
        setError('error-load')
      }
    }

    set()
  }, [pairName])

  // init
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: joinPair({ pairName, separator: 'layout' }),
      interval: intervalTransform(currentInterval.interval),
      datafeed,
      library_path: '/charting_library/',
      container_id: 'TVChartContainer',
      locale: getLocaleString(router.locale),
      theme: theme === EColorTheme.Dark ? 'Dark' : 'Light',
      custom_css_url: '../../../../../../charting_library/custom-styles/styles.css',
      timezone: getTimeZone(),
      autosize: true,
      disabled_features: [
        'edit_buttons_in_legend',
        'save_chart_properties_to_local_storage',
        'volume_force_overlay',
        'create_volume_indicator_by_default'
      ],
      studies_overrides: {
        'volume.volume.color.0': 'rgba(255, 12, 26, 0.5)',
        'volume.volume.color.1': 'rgba(7, 166, 73, 0.5)'
      },
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': GREEN,
        'mainSeriesProperties.candleStyle.downColor': RED,
        'mainSeriesProperties.candleStyle.borderUpColor': GREEN,
        'mainSeriesProperties.candleStyle.borderDownColor': RED,
        'mainSeriesProperties.candleStyle.borderColor': GREEN,
        'mainSeriesProperties.candleStyle.wickUpColor': GREEN,
        'mainSeriesProperties.candleStyle.wickDownColor': RED
      }
    }

    widgetInst.current = new Widget(widgetOptions)
    return () => {
      if (widgetInst.current !== null) {
        widgetInst.current.remove()
        widgetInst.current = null
      }
    }
  }, [theme])

  return (
    <div className={s.container}>
      <div id="TVChartContainer" className={s.chartContainer} />
    </div>
  )
}

export default Chart
