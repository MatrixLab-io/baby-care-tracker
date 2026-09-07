import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowPathIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { getErrorMessage } from '../utils/errorMessages';
import AppShell from '../components/AppShell';
import DatePicker from '../components/DatePicker';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import { BloodDropIcon, BoyIcon, GirlIcon } from '../components/ui/GlyphIcons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ChipSelect from '../components/ui/ChipSelect';
import SectionHeader from '../components/ui/SectionHeader';
import { Field } from '../components/ui/FormField';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { id: 'male', label: 'Boy', icon: BoyIcon },
  { id: 'female', label: 'Girl', icon: GirlIcon },
];

// Storage limits
const MAX_FILE_SIZE = 500 * 1024; // 500KB per file
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB total

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileRow = ({ file, onRemove, removeLabel }) => (
  <div className="flex items-center justify-between gap-3 p-3">
    <div className="flex items-center gap-3 min-w-0">
      <DocumentIcon className="w-5 h-5 text-ink-2 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm text-ink truncate">{file.name}</p>
        <p className="text-xs text-ink-3">{formatFileSize(file.size)}</p>
      </div>
    </div>
    <button type="button" onClick={onRemove} className="btn-icon btn-icon-danger shrink-0" aria-label={removeLabel}>
      <TrashIcon className="w-[18px] h-[18px]" aria-hidden="true" />
    </button>
  </div>
);

const AddEditBaby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBaby, updateBaby, babies, addMedicalRecord, deleteMedicalRecord } = useBaby();
  const fileInputRef = useRef(null);

  const isEdit = Boolean(id);
  const existingBaby = babies.find((baby) => baby.id === id);

  const [formData, setFormData] = useState({ name: '', dob: '', gender: '', bloodGroup: '', photo: '' });
  const [errors, setErrors] = useState({});
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && existingBaby) {
      setFormData({
        name: existingBaby.name,
        dob: existingBaby.dob,
        gender: existingBaby.gender || '',
        bloodGroup: existingBaby.bloodGroup || '',
        photo: existingBaby.photo || '',
      });
    }
  }, [isEdit, existingBaby]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (new Date(formData.dob) > new Date()) {
      newErrors.dob = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalRecordsSize = () => {
    const existingSize = (existingBaby?.medicalRecords || []).reduce((sum, r) => sum + (r.size || 0), 0);
    const pendingSize = pendingFiles.reduce((sum, f) => sum + f.size, 0);
    return existingSize + pendingSize;
  };

  const totalSize = getTotalRecordsSize();
  const storagePercent = Math.min(100, (totalSize / MAX_TOTAL_SIZE) * 100);
  const storageTight = totalSize > 4 * 1024 * 1024;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadError('');

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const newFilesSize = files.reduce((sum, f) => sum + f.size, 0);
    const projectedTotalSize = totalSize + newFilesSize;

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only PDF, JPG and PNG files are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(
          `"${file.name}" is ${(file.size / 1024).toFixed(0)}KB. The limit is 500KB per file — compress or resize it first.`,
        );
        return;
      }
    }

    if (projectedTotalSize > MAX_TOTAL_SIZE) {
      const availableSpace = Math.max(0, MAX_TOTAL_SIZE - totalSize);
      setUploadError(
        `That would take you to ${(projectedTotalSize / (1024 * 1024)).toFixed(1)}MB of 5MB. ` +
          `You have ${(availableSpace / 1024).toFixed(0)}KB left — remove a file or use a smaller one.`,
      );
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPendingFiles((prev) => [
          ...prev,
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePendingFile = (fileId) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDeleteMedicalRecord = (recordId) => {
    if (window.confirm('Delete this medical record? This cannot be undone.')) {
      deleteMedicalRecord(recordId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (isEdit) {
        await updateBaby(id, formData);
        for (const file of pendingFiles) {
          await addMedicalRecord({ name: file.name, type: file.type, size: file.size, data: file.data });
        }
      } else {
        await addBaby({
          ...formData,
          medicalRecords: pendingFiles.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            size: f.size,
            data: f.data,
            uploadedAt: new Date().toISOString(),
          })),
        });
      }
      navigate('/records');
    } catch (err) {
      console.error('Error saving baby:', err);
      setErrors({ submit: getErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell width="narrow" header={{ showBack: true }}>
      <Card>
        <SectionHeader
          as="h1"
          eyebrow={isEdit ? 'Edit profile' : 'New profile'}
          title={isEdit ? 'Edit baby profile' : 'Add baby profile'}
          lead={
            isEdit
              ? "Update your baby's details and documents."
              : "Enter your baby's details to start tracking vaccines and milestones."
          }
        />

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isSaving} className="flex flex-col gap-5">
            <Field
              label="Baby's name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your baby's name"
              error={errors.name}
            />

            <DatePicker
              label="Date of birth"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
              help="Every due date is worked out from this."
              placeholder="Select date of birth"
            />

            <ChipSelect
              label="Gender"
              help="Optional."
              options={GENDERS}
              value={formData.gender}
              onChange={(value) => setField('gender', value)}
              clearable
            />

            <ChipSelect
              label="Blood group"
              labelIcon={BloodDropIcon}
              help="Optional."
              options={BLOOD_GROUPS}
              value={formData.bloodGroup}
              onChange={(value) => setField('bloodGroup', value)}
              clearable
              columns="grid-cols-4"
            />

            <Field
              label="Photo URL"
              name="photo"
              type="url"
              help="Optional. Paste a link to a photo."
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />

            {formData.photo && (
              <div className="flex items-center gap-3">
                <Avatar src={formData.photo} name={formData.name} size="lg" />
                <p className="text-[13px] text-ink-2">Preview</p>
              </div>
            )}

            {/* Medical records */}
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <span className="label mb-1">Medical records</span>
                <p className="text-xs text-ink-2">
                  Birth certificates, reports, prescriptions. PDF, JPG or PNG, up to 500KB each.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-2">Storage used</span>
                  <span className={`font-medium ${storageTight ? 'text-danger-fg' : 'text-ink'}`}>
                    {formatFileSize(totalSize)} / 5 MB
                  </span>
                </div>
                <div
                  className="meter"
                  role="progressbar"
                  aria-valuenow={Math.round(storagePercent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Document storage used"
                >
                  <div
                    className={`meter-fill ${storageTight ? 'bg-danger-fg' : ''}`}
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
              />

              <button type="button" onClick={() => fileInputRef.current?.click()} className="dropzone">
                <DocumentArrowUpIcon className="w-7 h-7" aria-hidden="true" />
                <span className="text-sm font-medium">Click to upload files</span>
              </button>

              {uploadError && <Alert tone="danger">{uploadError}</Alert>}

              {pendingFiles.length > 0 && (
                <div>
                  <span className="eyebrow">Ready to upload</span>
                  <div className="card row-divider mt-2">
                    {pendingFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        onRemove={() => removePendingFile(file.id)}
                        removeLabel={`Remove ${file.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {isEdit && existingBaby?.medicalRecords?.length > 0 && (
                <div>
                  <span className="eyebrow">Uploaded records</span>
                  <div className="card row-divider mt-2">
                    {existingBaby.medicalRecords.map((record) => (
                      <FileRow
                        key={record.id}
                        file={record}
                        onRemove={() => handleDeleteMedicalRecord(record.id)}
                        removeLabel={`Delete ${record.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {errors.submit && <Alert tone="danger" className="mt-5">{errors.submit}</Alert>}

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => navigate('/records')} fullWidth disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              icon={isSaving ? ArrowPathIcon : isEdit ? PencilSquareIcon : UserPlusIcon}
              loading={isSaving}
              fullWidth
            >
              {isSaving ? 'Saving' : isEdit ? 'Update baby' : 'Add baby'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};

export default AddEditBaby;
