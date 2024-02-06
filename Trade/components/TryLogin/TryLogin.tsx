import React from 'react'
import { ROUTES } from '@/routes'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '@/components/buttons/Button'
import s from './TryLogin.module.scss'

export const TryLogin: React.FC = () => {
  const { t } = useTranslation('trade')

  return (
    <div className={s.container}>
      <Button theme="link" linkTo={ROUTES.SIGN_IN} label={t('history.sign_in')} />
      <span className={s.text}>or</span>
      <Button theme="link" linkTo={ROUTES.SIGN_UP} label={t('history.register')} />
    </div>
  )
}
