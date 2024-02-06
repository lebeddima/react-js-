import { Text } from '@/components/Text'
import { BaseLink } from '@/components/links/BaseLink'

type TLink = {
  href?: string
}

export const Link: React.FC<TLink> = ({ children, href = '' }) => (
  <BaseLink href={href}>
    <Text tag="span" color="primary400" variant="b4">
      {children}
    </Text>
  </BaseLink>
)
