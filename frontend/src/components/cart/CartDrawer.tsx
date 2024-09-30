import { AppDispatch, RootState } from '../../app/store';
import { Button, Divider, Drawer, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  applyDiscountCode,
  applyDiscountCodeLocal,
  fetchCart,
} from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import CartItem from './CartItem';

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Local state to handle discount feedback
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);

  // Accessing the cart state from the Redux store
  const { items, subTotal, tax, discountAmount, total, loading } = useSelector(
    (state: RootState) => state.cart
  );

  // Fetch the cart items once the drawer is opened
  useEffect(() => {
    if (visible) {
      dispatch(fetchCart());
      const storedDiscountCode = localStorage.getItem('discountCode');
      const storedDiscountAmount = localStorage.getItem('discountAmount');

      if (storedDiscountCode && storedDiscountAmount) {
        setAppliedDiscount(storedDiscountCode);
        dispatch(applyDiscountCodeLocal(storedDiscountCode));
        setDiscountError(null); // Clear any errors
      }
    }
  }, [visible, dispatch]);

  // Handle applying a discount code
  const handleApplyDiscount = (discountCode: string) => {
    if (discountCode) {
      if (isAuthenticated) {
        dispatch(applyDiscountCode(discountCode))
          .unwrap()
          .then(() => {
            setAppliedDiscount(discountCode);
            setDiscountError(null);
          })
          .catch((err) => {
            setDiscountError(err);
          });
      } else {
        dispatch(applyDiscountCodeLocal(discountCode));
        setAppliedDiscount(discountCode); 
        setDiscountError(null);
      }
    }
  };

  const totalQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Drawer
      title={
        <span className='text-2xl font-bold'>{`Cart (${totalQuantity})`}</span>
      }
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

              <Divider className='my-2' />

              {/* Apply Discount Code */}
              <div className='flex flex-col mb-4'>
                <label className='mb-2 font-semibold'>
                  Apply Discount Code
                </label>
                <div className='flex justify-between'>
                  <Input
                    className='w-96'
                    placeholder='20 DOLLAR OFF'
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
                    className='ml-2'
                  >
                    Apply
                  </Button>
                </div>
                {/* Discount Feedback */}
                {discountError && (
                  <p className='text-red-500 mt-2'>{discountError}</p>
                )}
              </div>

              <Divider />

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
                {appliedDiscount ? <span></span> : <span>-$0</span>}
              </div>

              {appliedDiscount && (
                <div className='mb-4 text-green-600 font-semibold'>
                  <div className='flex justify-between pl-4'>
                    <span>{`"${appliedDiscount}" applied:`}</span>
                    <span>{`- $${discountAmount.toFixed(2)}`}</span>
                  </div>
                </div>
              )}

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
