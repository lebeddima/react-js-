import styled from 'styled-components'
import { Spacer } from '@/components/Spacer'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/Skeleton'
import { deviceCssQuery } from '@/styles/breakpoints'
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader'
import { DeliveryOptions } from './DeliveryOptions'

const Container = styled.div`
  padding: 32px 16px;

  @media screen and (${deviceCssQuery.sm}) {
    padding: 32px 40px;
  }
`

const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SkeletonItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const DynamicSkyFlow = dynamic(() => import('../context/SkyFlow'), {
  loading: () => (
    <SkeletonList>
      {[1, 2, 3].map((index) => (
        <SkeletonItem key={index}>
          <Skeleton width="216px" height="26px" />
          <Skeleton width="60px" height="18px" />
        </SkeletonItem>
      ))}
    </SkeletonList>
  ),
  ssr: false,
})

export const CheckoutPaymentStep: React.FC = () => (
  <Container>
    <Spacer xs={{ margin: '0 0 40px' }}>
      <CheckoutStepsHeader />
    </Spacer>
    <DeliveryOptions />
    <DynamicSkyFlow />
  </Container>
)
