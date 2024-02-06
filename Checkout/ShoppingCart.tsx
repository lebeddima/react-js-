import { Portal } from '@/components/Portal'
import { zIndex } from '@/styles/z-index'
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './components/Header'
import { Content } from './containers/Content'
import { useShoppingCart } from './hooks/use-shopping-cart'
import { TShoppingCartStorage } from './types'
import { shoppingCartStorage } from './api/browser/shopping-cart-storage'

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  display: flex;
  z-index: ${zIndex.high};
  background-color: ${({ theme }) => hexToRGBA(theme.palette.base900, 0.6)};
`

const Container = styled(motion.div)`
  position: relative;
  width: 600px;
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.base000};
`

export const ShoppingCart: React.FC = () => {
  const router = useRouter()
  const { cart, init, show, close } = useShoppingCart()
  const { stopScroll, setContainerElem } = useScrollLock()

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    const simpleData = cart.reduce<TShoppingCartStorage>((accumulator, item) => {
      const products = item.products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }))
      return accumulator.concat(products)
    }, [])

    shoppingCartStorage.set(simpleData)
  }, [cart])

  useEffect(() => {
    if (!show) {
      stopScroll(false)
      return
    }

    setContainerElem(document.querySelector('#shopping-cart-overlay'))

    stopScroll(true)
  }, [show])

  useEffect(() => {
    router.events.on('routeChangeStart', close)
  }, [])

  const handleMouseDown = () => {
    close()
  }

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }

  useEffect(() => {
    if (!show) return

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [show])

  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <Backdrop
            onMouseDown={handleMouseDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Container
              initial={{ x: 30 }}
              animate={{ x: 0 }}
              exit={{ x: 30 }}
              // transition={{ ease: 'easeInOut', duration: 0.3 }}
              id="shopping-cart-overlay"
              onMouseDown={handleStopPropagation}
            >
              <Header />
              <Content />
            </Container>
          </Backdrop>
        )}
      </AnimatePresence>
    </Portal>
  )
}
