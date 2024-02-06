import { useLoading } from '@/features/trade/hooks/candle-chart/use-loading'
import { Loader } from '@/components/loaders/Loader'

export const Loading: React.FC = () => {
  const { initLoading } = useLoading()

  if (!initLoading) return null

  return <Loader bgColor="background" />
}
