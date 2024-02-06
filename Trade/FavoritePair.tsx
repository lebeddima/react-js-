import { useFavorite } from '@/features/trade/hooks/pair/use-favorite'
import { FavoritePair as Container } from '@/containers/FavoritePair'
import { useAuth } from '@/hooks/useAuth'
import s from './styles/FavoritePair.module.scss'

export const FavoritePair: React.FC = () => {
  const { favorite, setFavorit } = useFavorite()
  const { user } = useAuth()

  if (favorite === undefined || !user) return null

  const handlFavorite = ({ isFavourite }: { isFavourite: boolean }) => {
    setFavorit(isFavourite)
  }

  return (
    <div className={s.container}>
      <Container
        isFavorite={favorite.isFavorite}
        main={favorite.main}
        base={favorite.base}
        onChange={handlFavorite}
      />
    </div>
  )
}
