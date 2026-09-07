import { useState } from 'react';
import {
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import Alert from './ui/Alert';
import Button from './ui/Button';
import ChipSelect from './ui/ChipSelect';
import Modal from './ui/Modal';
import FormField, { Field, TextArea } from './ui/FormField';

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = 'f61a999e-e6bf-4583-844a-14a3d25c5cb2';

const TYPES = [
  { id: 'feedback', label: 'Feedback' },
  { id: 'feature', label: 'Feature request' },
];

const EMPTY_FORM = { type: 'feedback', name: '', email: '', message: '' };

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject:
            formData.type === 'feature'
              ? `[Feature Request] Baby Care Tracker - ${formData.name}`
              : `[Feedback] Baby Care Tracker - ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          type: formData.type === 'feature' ? 'Feature Request' : 'Feedback',
          message: formData.message,
          app: 'Baby Care & Vaccine Tracker',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormData(EMPTY_FORM);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('error');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStatus('idle'), 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-accent fixed bottom-6 right-6 z-40 w-12 h-12 px-0 rounded-full shadow-lift"
        aria-label="Send feedback"
        title="Send feedback"
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Send feedback"
        description="Tell us what works, what does not, or what is missing."
        size="sm"
        dismissable={status !== 'loading'}
      >
        {status === 'success' ? (
          <div className="text-center py-6" role="status">
            <CheckCircleIcon className="w-12 h-12 text-live-fg mx-auto mb-4" aria-hidden="true" />
            <p className="text-ink font-semibold mb-1">Thank you</p>
            <p className="text-sm text-ink-2 mb-6">Your feedback is on its way to us.</p>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === 'error' && <Alert tone="danger">Failed to send feedback. Please try again.</Alert>}

            <ChipSelect
              label="Type"
              required
              options={TYPES}
              value={formData.type}
              onChange={(type) => setFormData((prev) => ({ ...prev, type }))}
            />

            <Field
              label="Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />

            <Field
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <FormField label="Message" required htmlFor="message">
              <TextArea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={
                  formData.type === 'feature'
                    ? 'Describe the feature you would like to see…'
                    : 'Share your thoughts, suggestions, or report an issue…'
                }
              />
            </FormField>

            <Button
              type="submit"
              icon={status === 'loading' ? ArrowPathIcon : PaperAirplaneIcon}
              loading={status === 'loading'}
              fullWidth
            >
              {status === 'loading' ? 'Sending' : 'Send feedback'}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default FeedbackButton;
