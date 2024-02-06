import { useState } from 'react'
import { TPair } from '@/types/global'
import { CurrencyItem } from '@/components/CurrencyItem'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { SearchSimple } from '@/components/inputs/SearchSimple'
import { usePairs } from '@/features/trade/hooks/switch-pairs/use-pairs'
import { usePairName } from '@/features/trade/hooks/switch-pairs/use-pair-name'
import { joinPair } from '@/utils/join-pair'
import s from './SwitchPairs.module.scss'

export type TFilterType = 'crypto' | 'fiat'

type TSwitchPairs = {
  onChangePair: () => void
}

export const SwitchPairs: React.FC<TSwitchPairs> = ({ onChangePair }) => {
  const { t } = useTranslation('trade')
  const { pairs } = usePairs()
  const { pairName, setPairName } = usePairName()
  const [searcVal, setSearchVal] = useState('')

  const handleChangePair = (pair: TPair) => {
    const pairCode = { main: pair.mainCurrency.code, base: pair.baseCurrency.code }
    setPairName(pairCode)
    onChangePair()
  }

  const RenderList = () => {
    const result: JSX.Element[] = []

    pairs.forEach((item) => {
      const itemPairName = { main: item.mainCurrency.code, base: item.baseCurrency.code }

      const hasFilter = joinPair({
        pairName: itemPairName,
        separator: 'layout'
      }).includes(searcVal.toLowerCase())

      if (searcVal && !hasFilter) {
        return
      }

      const hasSelected =
        pairName.main === itemPairName.main && pairName.base === itemPairName.base

      const element = (
        <div
          key={item.id}
          className={cn(s.listItem, { [s.selected]: hasSelected })}
          onClick={() => handleChangePair(item)}
        >
          <div className={s.left}>
            <CurrencyItem
              img={item.mainCurrency.logoPng}
              text={joinPair({ pairName: itemPairName, separator: 'layout' })}
              textFont="text-medium"
              alt="currency"
              color={item.mainCurrency.colorHex}
              imgWidth={32}
              upperCase
            />
          </div>
        </div>
      )

      result.push(element)
    })

    return result
  }

  return (
    <div className={s.menu}>
      <div className={s.search}>
        <SearchSimple
          onChange={(val) => setSearchVal(val)}
          placeholder={t('switch-pairs.search-pair')}
        />
      </div>

      <div className={s.tableHeader}>
        <span>{t('common:pair')}</span>
      </div>

      <div className={s.list}>{RenderList()}</div>
    </div>
  )
}
