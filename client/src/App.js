import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/userSlice';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import Profile from './pages/Profile/Profile';

function AppWrapper() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const handleLoginSuccess = (payload) => {
        dispatch(loginSuccess(payload));
        setIsLoginOpen(false);
        setIsRegisterOpen(false);

    };

    return (
        <>
            <Header
                isLoginOpen={isLoginOpen}
                setIsLoginOpen={setIsLoginOpen}
                isRegisterOpen={isRegisterOpen}
                setIsRegisterOpen={setIsRegisterOpen}
                onLoginSuccess={handleLoginSuccess}
                navigate={navigate}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            onOpenLogin={() => setIsLoginOpen(true)}
                            navigate={navigate}
                        />
                    }
                />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}
