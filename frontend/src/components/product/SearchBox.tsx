import React, { useState, FormEvent } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams<{ keyword: string }>();
  const [keyword, setKeyword] = useState<string>(urlKeyword || '');

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      // setKeyword('');
      navigate(`/search/${keyword}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className='flex items-center space-x-4 w-full flex-shrink'
    >
      <Input
        type='text'
        name='q'
        placeholder='Search Products...'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        suffix={<SearchOutlined className='text-gray-400' />}
        style={{ width: '300px' }} // Set the width of the Input to 300px
        className='rounded-md'
      />
      <Button type='primary' htmlType='submit' className='p-2 mx-2'>
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
