import { useUpdateEffect } from 'react-use'
import { useAuth } from '@/hooks/useAuth'
import { SideTab } from './containers/create-order/SideTab'
import { OrderTab } from './containers/create-order/OrderTab'
import { Success } from './containers/create-order/Success'
import { Confirm } from './containers/create-order/Confirm'
import { useBalance } from './hooks/create-order/use-balance'
import { CurrencyHeader } from './containers/create-order/CurrencyHeader'
import { FormLimit } from './containers/create-order/FormLimit'
import s from './styles/CreateOrder.module.scss'
import { useOrderType } from './hooks/create-order/use-order-type'
import { FormMarket } from './containers/create-order/FormMarket'

export const CreateOrder: React.FC = () => {
  const { user } = useAuth()
  const { removeBalances } = useBalance()
  const { orderType } = useOrderType()

  useUpdateEffect(() => {
    if (user) return
    removeBalances()
  }, [user])

  return (
    <>
      <div className={s.container}>
        <CurrencyHeader />
        <SideTab />
        <OrderTab />
        {orderType === 'limit' && <FormLimit />}
        {orderType === 'market' && <FormMarket />}
      </div>

      <Success />
      <Confirm />
    </>
  )
}
