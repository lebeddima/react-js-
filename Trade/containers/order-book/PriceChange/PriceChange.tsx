import cn from 'classnames'
import { Icon } from '@/components/Icon'
// import { toFixed } from '@utils'
import { useDeals } from '@/features/trade/hooks/deals/use-deals'
import s from './PriceChange.module.scss'

type PriceChange = {
  className?: string
}

export const PriceChange: React.FC<PriceChange> = ({ className }) => {
  const { deals } = useDeals()

  const lastDeal = deals[0]

  if (!lastDeal) return null

  const up = lastDeal.isBuy

  return (
    <div className={cn(s.container, className, { [s.up]: up })}>
      <div className={cn(s.content)}>
        <Icon id="arrowDown" size="small" className={cn(s.icon)} />
        <span id="price" className={cn(s.price)}>
          {lastDeal.p}
        </span>
      </div>
    </div>
  )
}
