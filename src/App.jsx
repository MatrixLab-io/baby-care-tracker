import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BabyProvider } from './context/BabyContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import AddEditBaby from './pages/AddEditBaby';
import Dashboard from './pages/Dashboard';
import SharedView from './pages/SharedView';
import FeedbackButton from './components/FeedbackButton';
import UpdateNotification from './components/UpdateNotification';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <BabyProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-baby" element={<AddEditBaby />} />
            <Route path="/edit-baby/:id" element={<AddEditBaby />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/share" element={<SharedView />} />
          </Routes>
          <FeedbackButton />
          <UpdateNotification />
        </BabyProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
