import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { ROUTES } from '@/constants/routes'
import { deviceCssQuery } from '@/styles/breakpoints'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'

const Container = styled.div`
  background-color: ${({ theme }) => theme.palette.base000};
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;

  @media screen and (${deviceCssQuery.sm}) {
    border-radius: 30px;
    padding: 56px 120px;
  }
`

const Heading = styled(Text)`
  max-width: 600px;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media screen and (${deviceCssQuery.sm}) {
    width: 385px;
  }
`

export const CheckoutSuccess: React.FC = () => {
  const { t } = useTranslation('checkout')

  return (
    <Container>
      <Heading variant="b2" margin="0 0 32px">
        {t('success.subtitle')}
      </Heading>
      <Actions>
        <Button size="l" width="100%" variant="primary" href={ROUTES.PRODUCT_CATALOG}>
          {t('success.continue')}
        </Button>
        <Button size="l" width="100%" variant="tertiary-2" href={ROUTES.ORDERS}>
          {t('success.view-orders')}
        </Button>
      </Actions>
    </Container>
  )
}
