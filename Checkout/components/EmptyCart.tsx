import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { ROUTES } from '@/constants/routes'
import { SadFaceIcon } from '@/icons/SadFace'
import useTranslation from 'next-translate/useTranslation'
import { useEmbedContext } from 'providers/EmbedProvider'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

type Props = {
  onClose?: () => void
}

export const EmptyCart: React.FC<Props> = ({ onClose }) => {
  const { embed, storeData } = useEmbedContext()
  const { t } = useTranslation('shopping-cart')

  const href = embed
    ? `${ROUTES.STORE_CATALOG}?dispensary=${storeData?.uri}`
    : ROUTES.PRODUCT_CATALOG

  return (
    <Container>
      <SadFaceIcon />
      <Text variant="h4" margin="8px 0" color="base700">
        {t('empty-cart-title')}
      </Text>
      <Text variant="b3" margin="0 0 24px">
        {t('empty-cart-subtitle')}
      </Text>
      <Button href={href} variant="primary" size="l" onClick={onClose}>
        {t('empty-cart-button')}
      </Button>
    </Container>
  )
}
