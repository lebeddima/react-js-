import { useRedux } from '@/hooks/use-redux'
import { setOpen } from './store/logout'

type TRenderProps = {
  onClick: () => void
}

type TProps = {
  target: ({ onClick }: TRenderProps) => JSX.Element
}

export const LogoutButton: React.FC<TProps> = ({ target }) => {
  const { dispatch } = useRedux()
  const onClick = () => {
    dispatch(setOpen(true))
  }

  return target({ onClick })
}
