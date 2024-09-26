import React from 'react';
import AuthForm from '../../components/auth/form';

const UpdatePasswordPage: React.FC = () => {
    const handleUpdatePassword = (values: any) => {
        console.log('Mock password update', values);
    };

    return <AuthForm onFinish={handleUpdatePassword} isUpdatePassword />;
};

export default UpdatePasswordPage;
