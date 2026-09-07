import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { auth } from '../../config/firebase';
import { getErrorMessage } from '../../utils/errorMessages';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';

const EmailVerifyPage = () => {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) {
        setStatus('invalid');
        setError('This link is invalid or has expired.');
        return;
      }

      let email = window.localStorage.getItem('emailForSignIn');

      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (!email) {
        setStatus('error');
        setError('Email is required to complete sign-in.');
        return;
      }

      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        setStatus('error');
        setError(getErrorMessage(err));
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-ground flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center motion-rise">
        {status === 'verifying' && (
          <>
            <Spinner size="lg" className="mx-auto mb-4" />
            <h1 className="text-[17px] font-semibold text-ink">Verifying your email…</h1>
            <p className="text-sm text-ink-2 mt-1">Hold on while we sign you in.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className="w-12 h-12 text-live-fg mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-[17px] font-semibold text-ink">Signed in</h1>
            <p className="text-sm text-ink-2 mt-1">Taking you to the app…</p>
          </>
        )}

        {(status === 'error' || status === 'invalid') && (
          <>
            <XCircleIcon className="w-12 h-12 text-danger-fg mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-[17px] font-semibold text-ink">Verification failed</h1>
            <p className="text-sm text-ink-2 mt-1 mb-6">{error}</p>
            <Button variant="secondary" onClick={() => navigate('/auth')}>
              Back to sign in
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default EmailVerifyPage;
