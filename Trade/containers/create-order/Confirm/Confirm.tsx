import useTranslation from 'next-translate/useTranslation'
import { useRedux } from '@/hooks/useRedux'
import cn from 'classnames'
import { useOrderType } from '@/features/trade/hooks/create-order/use-order-type'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { joinPair } from '@/utils/join-pair'
import { createAsync } from '@/features/trade/store/create-order'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'
import { useConfirm } from '@/features/trade/hooks/create-order/use-confirm'
import { useSide } from '@/features/trade/hooks/create-order/use-side'
import s from './ModalConfirm.module.scss'

export const Confirm: React.FC = () => {
  const { t } = useTranslation('trade')
  const [, dispatch] = useRedux()
  const { confirm, setConfirm } = useConfirm()
  const { side } = useSide()
  const { orderType } = useOrderType()
  const { pairName } = usePairName()

  if (!confirm) return null

  const hendlClose = () => setConfirm(null)

  const hendleCreate = () => {
    dispatch(createAsync())
  }

  const color = side === 'bid' ? 'green' : 'red'

  const type = side === 'bid' ? t('create-order.buy-btn') : t('create-order.sell-btn')

  const limit =
    orderType === 'limit'
      ? t('create-order.confirm-modal.limit')
      : t('create-order.confirm-modal.market')

  const renderContent = () => (
    <div className={s.content}>
      <div className={cn(s.item, s.pair)}>
        <span className={s.left}>
          {joinPair({ pairName, separator: 'layout' }).toUpperCase()}
        </span>
        <span className={cn(s.right, s[color])}>{`${type} / ${limit}`}</span>
      </div>

      {confirm[PRICE_FIELD] && (
        <div className={s.item}>
          <span className={s.left}>{`${t('create-order.price')}:`}</span>
          <span id="create-order-price" className={s.right}>{`${
            confirm.rate
          } ${pairName.base.toUpperCase()}`}</span>
        </div>
      )}

      {confirm[QUANTITY_FIELD] && (
        <div className={s.item}>
          <span className={s.left}>{`${t('create-order.amount')}:`}</span>
          <span id="create-order-amount" className={s.right}>{`${
            confirm[QUANTITY_FIELD]
          } ${pairName.main.toUpperCase()}`}</span>
        </div>
      )}

      {confirm[TOTAL_FIELD] && (
        <div className={s.item}>
          <span className={s.left}>{`${t('create-order.total')}:`}</span>
          <span id="create-order-total" className={s.right}>{`${
            confirm[TOTAL_FIELD]
          } ${pairName.base.toUpperCase()}`}</span>
        </div>
      )}

      <div className={s.disclaimer}>{t('create-order.confirm-modal.disclaimer')}</div>
    </div>
  )

  return (
    <ConfirmModal
      id="create-order-confirm"
      title={t('create-order.confirm-modal.title')}
      content={renderContent()}
      onClose={hendlClose}
      onCancel={hendlClose}
      onConfirm={hendleCreate}
      labelCancel={t('create-order.confirm-modal.cancel')}
      labelConfirm={t('create-order.confirm-modal.confirm')}
      width="200px"
      rowButtons
    />
  )
}
