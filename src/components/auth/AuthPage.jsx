import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../ui/Alert';
import Card from '../ui/Card';
import { LogoMark } from '../ui/Logo';
import { PageSpinner } from '../ui/Spinner';
import ThemeToggle from '../ui/ThemeToggle';
import GoogleSignInButton from './GoogleSignInButton';
import EmailOtpForm from './EmailOtpForm';
import AuthDivider from './AuthDivider';

const AuthPage = () => {
  const { user, loading, signInWithGoogle, sendOtpEmail, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  if (loading) {
    return <PageSpinner />;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearError();
    try {
      await signInWithGoogle();
      // Navigation happens via <Navigate> once the user state updates.
    } catch {
      // Error is handled in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmailLink = async (email) => {
    clearError();
    await sendOtpEmail(email);
  };

  return (
    <div className="min-h-screen bg-ground flex flex-col">
      <div className="page pt-4 flex justify-end">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col gap-6 motion-rise">
          <div className="flex flex-col gap-3">
            <LogoMark size={44} />
            <div>
              <h1 className="font-brand tracking-[-0.035em] text-[26px] text-ink">MyBabyCare</h1>
              <p className="text-[15px] text-ink-2 mt-1">
                Vaccines, growth and milestones — on the Bangladesh EPI schedule.
              </p>
            </div>
          </div>

          <Card>
            <h2 className="text-[17px] font-semibold text-ink mb-5">Sign in to continue</h2>

            {error && <Alert tone="danger" className="mb-4">{error}</Alert>}

            <GoogleSignInButton onClick={handleGoogleSignIn} disabled={isLoading} />

            <AuthDivider />

            <EmailOtpForm onSendLink={handleSendEmailLink} disabled={isLoading} />
          </Card>

          <p className="text-[13px] text-ink-2">
            By signing in, you agree to sync your data securely to the cloud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
