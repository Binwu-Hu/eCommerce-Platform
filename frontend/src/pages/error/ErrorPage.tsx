import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WarningOutlined } from '@ant-design/icons';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <WarningOutlined
          style={{ fontSize: '96px', color: '#7c3aed', marginBottom: '24px' }}
        />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops, something went wrong!
        </h1>
        <Button
          type="primary"
          style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}
          className="text-white rounded-lg px-6 py-3 hover:bg-purple-700 focus:bg-purple-700"
          onClick={handleGoHome}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;