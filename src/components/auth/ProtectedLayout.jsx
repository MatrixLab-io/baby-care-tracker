import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BabyProvider } from '../../context/BabyContext';
import { PageSpinner } from '../ui/Spinner';
import Landing from '../../pages/Landing';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageSpinner message="Loading…" />;
  }

  // A signed-out visitor at the root gets the landing page rather than a bare
  // sign-in box. Everywhere else still sends them to /auth and comes back.
  if (!user) {
    if (location.pathname === '/') {
      return <Landing />;
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <BabyProvider>
      <Outlet />
    </BabyProvider>
  );
};

export default ProtectedLayout;
