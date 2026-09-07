import { useState, useEffect } from 'react';
import { ArrowPathIcon, EnvelopeIcon, InboxIcon } from '@heroicons/react/24/outline';
import { getErrorMessage } from '../../utils/errorMessages';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import FormField, { TextInput } from '../ui/FormField';

const RESEND_SECONDS = 60;

const EmailOtpForm = ({ onSendLink, disabled }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCountdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      await onSendLink(email);
      setSent(true);
      setResendCountdown(RESEND_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    setSending(true);
    setError('');
    try {
      await onSendLink(email);
      setResendCountdown(RESEND_SECONDS);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-4 rounded-control bg-live-bg text-live-fg" role="status">
          <EnvelopeIcon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm min-w-0">
            <p className="font-semibold">Check your inbox</p>
            <p className="mt-0.5">
              We sent a magic link to <span className="font-semibold break-all">{email}</span>
            </p>
          </div>
        </div>

        <div className="rounded-control border border-line bg-surface-2 p-4">
          <p className="text-[13px] font-semibold text-ink flex items-center gap-2">
            <InboxIcon className="w-[18px] h-[18px] text-ink-2" aria-hidden="true" />
            How to sign in
          </p>
          <ol className="text-[13px] text-ink-2 list-decimal pl-5 mt-2 flex flex-col gap-1">
            <li>
              Open the email from <span className="font-medium text-ink">My Baby Care</span>
            </li>
            <li>
              Tap the <span className="font-medium text-ink">Sign in</span> button inside it
            </li>
            <li>You are signed in automatically</li>
          </ol>
        </div>

        <Alert tone="caution" title="Can't find the email?">
          Check your spam or junk folder. It is sent from{' '}
          <span className="font-medium">noreply@mybabycare.app</span>.
        </Alert>

        {error && <Alert tone="danger">{error}</Alert>}

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            icon={ArrowPathIcon}
            loading={sending}
            disabled={resendCountdown > 0}
            onClick={handleResend}
            fullWidth
          >
            {sending ? 'Sending' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend link'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail('');
              setError('');
            }}
            className="btn btn-plain self-start text-[13px]"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        label="Email address"
        htmlFor="email"
        help="We'll send a magic link — no password to remember."
        error={error}
      >
        <div className="relative">
          <EnvelopeIcon
            className="w-[18px] h-[18px] text-ink-3 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <TextInput
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={disabled || sending}
            error={error}
            className="pl-10"
          />
        </div>
      </FormField>

      <Button
        type="submit"
        icon={sending ? ArrowPathIcon : EnvelopeIcon}
        loading={sending}
        disabled={disabled || !email}
        fullWidth
      >
        {sending ? 'Sending magic link' : 'Send magic link'}
      </Button>
    </form>
  );
};

export default EmailOtpForm;
