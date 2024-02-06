import styled from 'styled-components'
import { BaseImage } from '@/components/BaseImage'
import { deviceCssQuery } from '@/styles/breakpoints'
import { Text } from '@/components/Text'
import useTranslation from 'next-translate/useTranslation'
import { BaseLink } from '@/components/links/BaseLink'
import { ROUTES } from '@/constants/routes'
import { TShoppingCartDispensary } from '../types'

const Container = styled.div`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: ${({ theme }) => theme.palette.secondary100};

  @media screen and (${deviceCssQuery.sm}) {
    padding: 10px 32px;
  }
`

const ImageCont = styled.div`
  width: 60px;
  height: 47px;
  position: relative;
  flex-shrink: 0;
`

const Name = styled(Text)`
  &:hover,
  &:focus {
    color: ${({ theme }) => theme.palette.primary700};
  }
`

const ContentContainer = styled.div`
  flex-grow: 1;
`

type StoreItemProps = {
  data: TShoppingCartDispensary
}

export const StoreItem: React.FC<StoreItemProps> = ({ data }) => {
  const { t } = useTranslation('shopping-cart')
  const { photo, dispName } = data

  return (
    <Container>
      <ImageCont>
        <BaseImage alt={dispName} src={photo} layout="fill" objectFit="cover" />
      </ImageCont>
      <ContentContainer>
        <Text variant="d1" color="base700" margin="0 0 4px">
          {t('store-item-subtitle')}
        </Text>
        <BaseLink href={`${ROUTES.STORE}/${data.uri}`}>
          <Name variants={{ xs: 'b4', sm: 'b2' }}>{dispName}</Name>
        </BaseLink>
      </ContentContainer>
      <Text variant="b2">{t('pick-up')}</Text>
    </Container>
  )
}
