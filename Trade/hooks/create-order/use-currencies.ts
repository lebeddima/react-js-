import { useRedux } from '@/hooks/useRedux'
import { selectCurrencies, TCurrencies } from '@/features/trade/store/create-order'

export const useCurrencies = (): TCurrencies => {
  const [select] = useRedux()
  const currencies = select(selectCurrencies)

  return { ...currencies }
}
