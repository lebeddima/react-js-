import { useRedux } from '@/hooks/useRedux'
import { selectFavorite, setFavorite as set } from '@/features/trade/store/pair'

type TReturn = {
  favorite?: {
    isFavorite: boolean
    main: string
    base: string
  }
  setFavorit: (x: boolean) => void
}

export const useFavorite = (): TReturn => {
  const [select, dispatch] = useRedux()

  const favorite = select(selectFavorite)
  const setFavorit: TReturn['setFavorit'] = (x) => dispatch(set(x))

  return { favorite, setFavorit }
}
