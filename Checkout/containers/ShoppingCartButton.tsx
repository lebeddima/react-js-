import { Button } from '@/components/buttons/Button'
import { Badge } from '@/components/Badge'
import { CartIcon } from '@/icons/Cart'
import { useShoppingCart } from '../hooks/use-shopping-cart'

type CartButtonProps = {
  label?: string
}

export const ShoppingCartButton: React.FC<CartButtonProps> = ({ label }) => {
  const { open, cart } = useShoppingCart()

  const handleCartClick = () => {
    open()
  }

  const shoppingCartItemcCount = cart.reduce(
    (acc, item) => acc + item.products.reduce((acc, item) => acc + item.quantity, 0),
    0,
  )

  return (
    <Button
      variant="tertiary-3"
      startIcon={
        <Badge value={shoppingCartItemcCount}>
          <CartIcon />
        </Badge>
      }
      onClick={handleCartClick}
    >
      {label}
    </Button>
  )
}
