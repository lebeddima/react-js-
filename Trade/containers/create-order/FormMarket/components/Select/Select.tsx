import { memo } from 'react'
import { Select as Component } from '@/components/inputs/selects/Select'
import { TSelectProps } from '@/components/inputs/selects/types'

export const Select: React.FC<TSelectProps> = memo((props) => <Component {...props} />)
