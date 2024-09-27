import React, { useState } from 'react';

import { Badge } from 'antd';
import CartDrawer from './CartDrawer';
import { RootState } from '../../app/store';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const CartTrigger: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  return (
    <div>
      <Badge count={cartItems.length} offset={[10, 0]}>
        <ShoppingCartOutlined
          style={{ fontSize: '24px', color: '#fff', cursor: 'pointer' }}
          onClick={showDrawer}
        />
      </Badge>
      <CartDrawer visible={visible} onClose={closeDrawer} />
    </div>
  );
};

export default CartTrigger;
