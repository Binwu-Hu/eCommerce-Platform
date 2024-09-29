import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React from 'react';

interface SortingOptionsProps {
  sortOption: string;
  onSortChange: (option: string) => void;
}

const SortingOptions: React.FC<SortingOptionsProps> = ({
  sortOption,
  onSortChange,
}) => {
  const menu = (
    <Menu onClick={(e) => onSortChange(e.key)}>
      <Menu.Item key='id_asc'>Default order</Menu.Item>
      <Menu.Item key='last_added'>Last added</Menu.Item>
      <Menu.Item key='price_low_to_high'>Price: low to high</Menu.Item>
      <Menu.Item key='price_high_to_low'>Price: high to low</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button>
        {sortOption === 'id_asc' && 'Default order'}
        {sortOption === 'last_added' && 'Last added'}
        {sortOption === 'price_low_to_high' && 'Price: low to high'}
        {sortOption === 'price_high_to_low' && 'Price: high to low'}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default SortingOptions;
