import styled from 'styled-components'
import { useAuth } from '@/hooks/use-auth'
import { Text } from '@/components/Text'
import useTranslation from 'next-translate/useTranslation'
import { Button } from '@/components/buttons/Button'
import { BaseLink } from '@/components/links/BaseLink'
import { ROUTES } from '@/constants/routes'
import { deviceCssQuery } from '@/styles/breakpoints'
import { ProfileIcon } from './components/ProfileIcon'

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
export const ProfileText = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  @media screen and (${deviceCssQuery.sm}) {
    display: flex;
  }
`

export const Auth = styled.div`
  display: flex;
  align-items: center;
  gap: 42px;
  position: relative;
  z-index: 1;
`

export const SignUp = styled(Button)`
  display: none;

  @media screen and (${deviceCssQuery.sm}) {
    display: flex;
  }
`

export const ButtonProfile: React.FC = () => {
  const { t } = useTranslation('auth-buttons')
  const { user } = useAuth()

  return (
    <>
      {!user && (
        <Auth>
          <BaseLink href={ROUTES.SIGN_IN}>
            <Text variant="b7">{t('login')}</Text>
          </BaseLink>

          <SignUp href={ROUTES.SIGN_UP} variant="gradient-border" size="l">
            {t('signup')}
          </SignUp>
        </Auth>
      )}
      {user && (
        <Profile>
          <BaseLink href={ROUTES.CABINET_DASHBOARD}>
            <ProfileIcon />
          </BaseLink>

          <ProfileText>
            <Text variant="b7">{`${user.firstName} ${user.lastName}`}</Text>
            <Text variant="b5">{user.balance}</Text>
          </ProfileText>
        </Profile>
      )}
    </>
  )
}
