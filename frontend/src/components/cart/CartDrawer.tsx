import { AppDispatch, RootState } from '../../app/store';
import { Button, Divider, Drawer, Input, Spin } from 'antd';
import React, { useEffect } from 'react';
import { applyDiscountCode, fetchCart } from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import CartItem from './CartItem';

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Accessing the cart state from the Redux store
  const { items, subTotal, tax, discountAmount, total, loading, error } =
    useSelector((state: RootState) => state.cart);

  // Fetch the cart items once the drawer is opened
  useEffect(() => {
    if (visible) {
      dispatch(fetchCart());
    }
  }, [visible, dispatch]);

  // Handle applying a discount code
  const handleApplyDiscount = (discountCode: string) => {
    if (discountCode) {
      dispatch(applyDiscountCode(discountCode));
    }
  };

  const totalQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Drawer
      title={`Cart (${totalQuantity})`}
      placement='right'
      onClose={onClose}
      visible={visible}
      width={600}
      className='bg-gray-100'
    >
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <Spin size='large' />
        </div>
      ) : error ? (
        <div className='text-red-500 text-center'>
          <p>Error loading cart: {error}</p>
        </div>
      ) : (
        <div className='p-4'>
          {/* Display Cart Items */}
          {items.length === 0 ? (
            <div className='text-center text-gray-500'>Your cart is empty</div>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}

              <Divider />

              {/* Apply Discount Code */}
              <div className='flex justify-between mb-4'>
                <Input
                  placeholder='Apply Discount Code'
                  onPressEnter={(e) =>
                    handleApplyDiscount((e.target as HTMLInputElement).value)
                  }
                />
                <Button
                  type='primary'
                  onClick={() =>
                    handleApplyDiscount(
                      (document.querySelector('input') as HTMLInputElement)
                        ?.value
                    )
                  }
                >
                  Apply
                </Button>
              </div>

              {/* Cart Totals */}
              <div className='mb-2 flex justify-between'>
                <span>Subtotal</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className='mb-2 flex justify-between'>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className='mb-2 flex justify-between'>
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className='mb-6 font-bold flex justify-between'>
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Buttons */}
              <Button type='primary' size='large' className='w-full mb-2'>
                Continue to checkout
              </Button>
            </>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
