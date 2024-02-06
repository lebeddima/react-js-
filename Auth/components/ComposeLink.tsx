import styled from 'styled-components'
import Trans from 'next-translate/Trans'
import { Link } from './Link'

type TComposeLink = {
  href?: string
  i18nKey: string
  textComponent: JSX.Element
  targetBlank?: boolean
  link?: JSX.Element
}

const Container = styled.div`
  text-align: center;
`

export const ComposeLink: React.FC<TComposeLink> = ({
  i18nKey,
  textComponent,
  link,
  ...props
}) => (
  <Container>
    <Trans
      i18nKey={i18nKey}
      components={{
        component: textComponent,
        link: link || <Link {...props} />,
      }}
    />
  </Container>
)
