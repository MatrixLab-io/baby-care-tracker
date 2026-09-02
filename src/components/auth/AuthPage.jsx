import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import EmailOtpForm from './EmailOtpForm';
import AuthDivider from './AuthDivider';
import BrandMark from '../BrandMark';

const AuthPage = () => {
  const { user, loading, signInWithGoogle, sendOtpEmail, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearError();
    try {
      await signInWithGoogle();
      // Navigation happens automatically via the Navigate component when user state updates
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
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandMark className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            MyBabyCare
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track your baby&apos;s growth and milestones
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          />

          <AuthDivider />

          <EmailOtpForm
            onSendLink={handleSendEmailLink}
            disabled={isLoading}
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to sync your data securely to the cloud.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
