import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedLayout from './components/auth/ProtectedLayout';
import AuthPage from './components/auth/AuthPage';
import EmailVerifyPage from './components/auth/EmailVerifyPage';
import Home from './pages/Home';
import AddEditBaby from './pages/AddEditBaby';
import Dashboard from './pages/Dashboard';
import SharedView from './pages/SharedView';
import Landing from './pages/Landing';
import FeedbackButton from './components/FeedbackButton';
import UpdateNotification from './components/UpdateNotification';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/verify" element={<EmailVerifyPage />} />
            <Route path="/share" element={<SharedView />} />
            <Route path="/welcome" element={<Landing />} />

            {/* Protected routes - share one BabyProvider */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/add-baby" element={<AddEditBaby />} />
              <Route path="/edit-baby/:id" element={<AddEditBaby />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
          <FeedbackButton />
          <UpdateNotification />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
