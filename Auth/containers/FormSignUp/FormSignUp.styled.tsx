import { Text } from '@/components/Text'
import { deviceCssQuery } from '@/styles/breakpoints'
import styled from 'styled-components'

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 32px;
`

export const InputCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media screen and (${deviceCssQuery.sm}) {
    flex-direction: row;
  }
`

export const CheckboxLabel = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`
