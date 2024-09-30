import React, { useState } from 'react';

import { Badge } from 'antd';
import CartDrawer from './CartDrawer';
import { RootState } from '../../app/store';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const CartTrigger: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const totalQuantity = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const { subTotal, tax, discountAmount } = useSelector((state: RootState) => ({
    subTotal: state.cart.subTotal,
    tax: state.cart.tax,
    discountAmount: state.cart.discountAmount,
  }));

  const totalAmount = subTotal + tax - discountAmount;

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  return (
    <div>
      <div
        className='flex items-center space-x-4 cursor-pointer'
        onClick={showDrawer}
        style={{ color: 'white' }}
      >
        <Badge
          count={totalQuantity}
          offset={[12, -6]}
          style={{ transform: 'scale(0.8)' }}
        >
          <ShoppingCartOutlined style={{ fontSize: '25px', color: 'white' }} />
        </Badge>
        <span className='hover:text-yellow-500'>
          {`$${totalAmount.toFixed(2)}`}
        </span>
      </div>
      <CartDrawer visible={visible} onClose={closeDrawer} />
    </div>
  );
};

export default CartTrigger;
