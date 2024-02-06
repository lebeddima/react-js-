import { ArrowIcon } from '@/icons/Arrow'
import { IconButton } from '@/components/buttons/IconButton'
import { TButtonCollapseProps } from '../types'

export const ButtonCollapse: React.FC<TButtonCollapseProps> = ({ isOpen, ...props }) => (
  <IconButton {...props}>
    <ArrowIcon direction={isOpen ? 'down' : 'up'} />
  </IconButton>
)
