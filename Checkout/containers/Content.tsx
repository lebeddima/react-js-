import React from 'react'
import styled from 'styled-components'
import { deviceCssQuery } from '@/styles/breakpoints'
import { Text } from '@/components/Text'
import useTranslation from 'next-translate/useTranslation'
import { motion } from 'framer-motion'
import { ROUTES } from '@/constants/routes'
import { ShoppingCartItem } from '../components/ShoppingCartItem'
import { StoreItem } from '../components/StoreItem'
import { TotalPrice } from '../components/TotalPrice'
import { TotalPriceFooter } from '../components/TotalPriceFooter'
import { useShoppingCart } from '../hooks/use-shopping-cart'
import { EmptyCart } from '../components/EmptyCart'

const Container = styled(motion.div)`
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const CartContainer = styled(motion.div)`
  padding-top: 32px;
`

const listFramerAnimation = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
}

const listItemFramerAnimation = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 50 },
}

const ShopingCartContent = styled.div`
  display: flex;
  flex-direction: column;
`

const ShopingCartTitle = styled(Text)`
  padding: 0 16px;

  @media screen and (${deviceCssQuery.sm}) {
    padding: 0 32px;
    margin-bottom: 8px;
  }
`

const List = styled(motion.div)`
  padding: 16px 16px 24px;

  @media screen and (${deviceCssQuery.sm}) {
    margin-top: 12px;
    padding: 16px 22px 32px 32px;
  }
`

export const Content: React.FC = () => {
  const { t } = useTranslation('shopping-cart')
  const { cart, updateProduct, removeProduct, close } = useShoppingCart()

  const handleChange = (productId: number, newQuantity: number) => {
    updateProduct(productId, newQuantity)
  }

  const handleDelete = (productId: number) => {
    removeProduct(productId)
  }

  const handleClose = () => {
    close()
  }

  const renderContent = () => {
    const isMultipleStores = cart.length > 1

    if (isMultipleStores) {
      return (
        <Container initial="hidden" animate="visible" variants={listFramerAnimation}>
          {cart.map(({ dispensary, products, total }, index) => (
            <CartContainer variants={listItemFramerAnimation} key={dispensary.id}>
              <ShopingCartTitle variant="h4">
                {t('numbered-title', { number: index + 1 })}
              </ShopingCartTitle>
              <ShopingCartContent>
                <StoreItem data={dispensary} />
                <List>
                  {products.map((product) => (
                    <ShoppingCartItem
                      key={product.id}
                      product={product}
                      onChange={handleChange}
                      onDelete={handleDelete}
                    />
                  ))}
                  <TotalPrice
                    products={products}
                    totalPrice={total}
                    href={`${ROUTES.CHECKOUT}?dispensaryId=${dispensary.id}`}
                  />
                </List>
              </ShopingCartContent>
            </CartContainer>
          ))}
        </Container>
      )
    }

    if (cart.length === 1) {
      return (
        <>
          <Container initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <List>
              {cart[0].products.map((product) => (
                <ShoppingCartItem
                  key={product.id}
                  product={product}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          </Container>
          <TotalPriceFooter
            price={cart[0].total}
            products={cart[0].products}
            href={`${ROUTES.CHECKOUT}?dispensaryId=${cart[0].dispensary.id}`}
          />
        </>
      )
    }

    return <EmptyCart onClose={handleClose} />
  }

  return renderContent()
}
