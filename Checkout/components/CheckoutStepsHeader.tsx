import { Text } from '@/components/Text'
import { useRedux } from '@/hooks/use-redux'
import { fontWeight } from '@/styles/fonts'
import useTranslation from 'next-translate/useTranslation'
import { deviceCssQuery } from '@/styles/breakpoints'
import styled, { css } from 'styled-components'
import { selectCheckoutStep } from '../store/checkout'

const Header = styled.header``

const StepButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  padding-left: 36px;
  padding-right: 73px;
`

const Line = styled.div<{ hide?: boolean }>`
  height: 2px;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.palette.primary300};
  border-radius: 30px;

  opacity: ${({ hide }) => (hide ? 0 : 1)};
`

const Labels = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TRANSITION_TIMER = '300ms'
const BUTTON_HEIGHT = '34px'
const BUTTON_WIDTH = '34px'
const BORDER_RADIUS = '8px'

const buttonBase = css`
  font-family: Poppins;
  font-weight: ${fontWeight.Medium};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${BUTTON_HEIGHT};
  min-width: ${BUTTON_WIDTH};
  flex-shrink: 0;
  padding: 8px;
  border-radius: ${BORDER_RADIUS};
  transition: background-color ${TRANSITION_TIMER};
  outline: none;
`

const StepButton = styled.button<{ active?: boolean; disabled?: boolean }>(
  (props) =>
    css`
      ${buttonBase}
      color: ${props.theme.palette.base900};
      background-color: ${({ theme }) => theme.palette.primary300};

      ${props.active &&
      css`
        color: ${props.theme.palette.base000};
        background-color: ${props.theme.palette.primary700};
        pointer-events: none;
      `}

      ${props.disabled &&
      css`
        pointer-events: none;
        color: ${props.theme.palette.base300};
      `}
    `,
)

const Desktop = styled.div`
  display: none;
  @media (${deviceCssQuery.sm}) {
    display: block;
  }
`

const Mobile = styled.div`
  display: block;
  @media (${deviceCssQuery.sm}) {
    display: none;
  }
`

const MobileStepContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const CheckoutStepsHeader: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { select } = useRedux()
  const step = select(selectCheckoutStep)

  const isPersonalInfoStep = step === 'personal-info'

  return (
    <Header>
      <Desktop>
        <ButtonsContainer>
          <StepButtonContainer>
            <StepButton active={isPersonalInfoStep}>1</StepButton>
          </StepButtonContainer>
          <Line />
          <StepButtonContainer>
            <StepButton active={!isPersonalInfoStep}>2</StepButton>
          </StepButtonContainer>
        </ButtonsContainer>
        <Labels>
          <Text variant="b2" color={isPersonalInfoStep ? 'base900' : 'base700'}>
            {t('steps.personal-info')}
          </Text>
          <Text variant="b2" color={isPersonalInfoStep ? 'base700' : 'base900'}>
            {t('steps.payment')}
          </Text>
        </Labels>
      </Desktop>
      <Mobile>
        {step === 'personal-info' && (
          <>
            <MobileStepContainer>
              <Line hide />
              <StepButton active>1</StepButton>
              <Line />
            </MobileStepContainer>
            <Text align="center" variant="b2">
              {t('steps.personal-info')}
            </Text>
          </>
        )}
        {step === 'payment' && (
          <>
            <MobileStepContainer>
              <Line />
              <StepButton active>2</StepButton>
              <Line hide />
            </MobileStepContainer>
            <Text textAlign="center" variant="b2">
              {t('steps.payment-mobile')}
            </Text>
          </>
        )}
      </Mobile>
    </Header>
  )
}
