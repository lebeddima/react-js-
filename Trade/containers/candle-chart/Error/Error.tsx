import useTranslation from 'next-translate/useTranslation'
import { useError } from '@/features/trade/hooks/candle-chart/use-error'
import s from './Error.module.scss'

export const Error: React.FC = () => {
  const { t } = useTranslation('trade')
  const { error } = useError()

  if (!error) return null

  return (
    <div className={s.container}>
      <div>{t(error)}</div>
    </div>
  )
}
