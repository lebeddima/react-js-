import useTranslation from 'next-translate/useTranslation'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useRedux } from '@/hooks/use-redux'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { selectLogoutModal, setOpen } from './store/logout'

export const LogoutModal: React.FC = () => {
  const { select, dispatch } = useRedux()
  const { open } = select(selectLogoutModal)
  const { t } = useTranslation('logout')
  const { logoutAsync, user, loading } = useAuth()

  const handleClose = () => {
    dispatch(setOpen(false))
  }

  const handleAccept = () => {
    logoutAsync()
  }

  useEffect(() => {
    if (!open) return

    if (!user) {
      handleClose()
    }
  }, [user, open])

  if (!open) return null

  return (
    <ConfirmModal
      title={t('modal.title')}
      description={t('modal.desc')}
      onCancel={handleClose}
      open
      maxWidth="488px"
      labelConfirm={t('modal.button')}
      onClose={handleClose}
      onConfirm={handleAccept}
      isLoading={loading}
    />
  )
}
