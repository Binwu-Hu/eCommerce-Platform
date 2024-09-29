import { AppDispatch, RootState } from '../../app/store';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export const useCartQuantityHandler = (productId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      const cartItem = items.find((item) => item.productId === productId);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    } else {
      const localCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      const localCartItem = localCartItems.find(
        (item: { productId: string }) => item.productId === productId
      );
      if (localCartItem) {
        setQuantity(localCartItem.quantity);
      }
    }
  }, [items, isAuthenticated, productId]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);

    if (isAuthenticated) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: quantity + 1,
        })
      );
    } else {
      dispatch(
        updateCartItemQuantityLocal({
          productId,
          quantity: quantity + 1,
        })
      );
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
      dispatch(addItemToCart({ productId, quantity: 1 }));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      setQuantity(0);
      dispatch(removeItemFromCart(productId));
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);

      if (isAuthenticated) {
        dispatch(
          updateCartItemQuantity({
            productId,
            quantity: quantity - 1,
          })
        );
      } else {
        dispatch(
          updateCartItemQuantityLocal({
            productId,
            quantity: quantity - 1,
          })
        );
      }
    }
  };

  return {
    quantity,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    handleRemoveFromCart,
  };
};
