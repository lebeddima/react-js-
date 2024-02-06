import React from 'react'
import { ButtonIcon } from '@/components/buttons/ButtonIcon'
import s from './Fullscreen.module.scss'

type TProps = {
  onClick: () => void
}

export const Fullscreen: React.FC<TProps> = ({ onClick }) => (
  <div className={s.button}>
    <ButtonIcon
      icon="fullscreen"
      styleContainer={{ marginLeft: '12px' }}
      iconColor="light-grey"
      onClick={onClick}
    />
  </div>
)
