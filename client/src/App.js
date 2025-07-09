import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile/Profile';
import HomePage from "./pages/HomePage/HomePage";
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;