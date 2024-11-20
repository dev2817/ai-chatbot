import { Outlet } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './utils/AuthContext';

export default function AuthLayout() {

    return (
        <div className='auth-div'>
            <div className='auth-layout'>
                <AuthProvider >
                    <Outlet />
                </AuthProvider>
            </div>
        </div>
    )
}
