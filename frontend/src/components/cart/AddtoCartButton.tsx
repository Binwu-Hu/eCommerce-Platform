import React, { useState } from 'react'
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice'

import { AppDispatch } from '../../app/store'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'

interface CartActionsProps {
  productId: string
  text: string
  className?: string
}

const CartActions: React.FC<CartActionsProps> = ({
  productId,
  text,
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [quantity, setQuantity] = useState<number>(0)

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1)
      dispatch(addItemToCart({ productId, quantity: 1 }))
    }
  }

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
    dispatch(
      updateCartItemQuantityLocal({
        productId,
        quantity: quantity + 1,
      })
    )
  }

  const handleDecrement = () => {
    if (quantity === 1) {
      setQuantity(0)
      dispatch(removeItemFromCart(productId))
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1)
      dispatch(
        updateCartItemQuantityLocal({
          productId,
          quantity: quantity - 1,
        })
      )
    }
  }

  return (
    <>
      {quantity === 0 ? (
        <Button type='primary' className={className} onClick={handleAddToCart}>
          {text}
        </Button>
      ) : (
        <div>
          <Button onClick={handleDecrement}>-</Button>
          <span className='mx-2'>{quantity}</span>
          <Button onClick={handleIncrement}>+</Button>
        </div>
      )}
    </>
  )
}

export default CartActions
