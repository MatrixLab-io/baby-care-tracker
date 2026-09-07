import { useState } from 'react';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorMessages';
import Alert from './ui/Alert';
import Button from './ui/Button';
import CheckItem from './ui/CheckItem';
import Modal from './ui/Modal';

const GUARANTEES = [
  'Data is stored securely in the cloud, linked to your account',
  'Only you can reach your data, through your authenticated account',
  'Your data syncs across every device you sign in on',
  'We do not share, sell, or use your data for advertising',
  'You can delete all your data at any time',
];

const PrivacyNotice = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const { deleteAllUserData, babies } = useBaby();
  const { user, signOut } = useAuth();

  const close = () => {
    setIsOpen(false);
    setShowDeleteConfirm(false);
    setDeleteError('');
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAllUserData();
      await signOut();
      close();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary btn-sm w-9 px-0"
        aria-label="Data privacy information"
        title="Data privacy"
      >
        <InformationCircleIcon className="w-[18px] h-[18px]" aria-hidden="true" />
      </button>

      <Modal
        isOpen={isOpen && !showDeleteConfirm}
        onClose={close}
        title="Data privacy"
        description="Where your data lives and who can reach it."
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            {GUARANTEES.map((line) => (
              <CheckItem key={line}>{line}</CheckItem>
            ))}
          </div>

          <p className="text-[13px] text-ink-2 pt-4 border-t border-line">
            <span className="font-semibold text-ink">What we store:</span> baby profiles, vaccine records,
            milestones, growth records, and uploaded medical documents.
          </p>

          {user && (
            <div className="pt-4 border-t border-line flex flex-col gap-3">
              <p className="text-[13px] text-ink-2">
                Want to remove everything? This cannot be undone.
              </p>
              <Button variant="danger" size="sm" icon={TrashIcon} onClick={() => setShowDeleteConfirm(true)} fullWidth>
                Delete all my data
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete all your data?"
        size="sm"
        dismissable={!isDeleting}
      >
        <div className="flex flex-col gap-4">
          <Alert tone="danger" icon={ExclamationTriangleIcon} title="This cannot be undone">
            Everything below is removed permanently and you are signed out.
          </Alert>

          <ul className="text-sm text-ink-2 flex flex-col gap-1 list-disc pl-5">
            <li>
              {babies.length} baby profile{babies.length !== 1 ? 's' : ''}
            </li>
            <li>All vaccine records</li>
            <li>All milestones</li>
            <li>All growth records</li>
            <li>All uploaded medical documents</li>
          </ul>

          {deleteError && <Alert tone="danger">{deleteError}</Alert>}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} fullWidth disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              icon={isDeleting ? ArrowPathIcon : TrashIcon}
              loading={isDeleting}
              onClick={handleDeleteAllData}
              fullWidth
            >
              {isDeleting ? 'Deleting' : 'Yes, delete all'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PrivacyNotice;
