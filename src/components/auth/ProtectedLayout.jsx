import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BabyProvider } from '../../context/BabyContext';
import { PageSpinner } from '../ui/Spinner';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageSpinner message="Loading…" />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <BabyProvider>
      <Outlet />
    </BabyProvider>
  );
};

export default ProtectedLayout;
