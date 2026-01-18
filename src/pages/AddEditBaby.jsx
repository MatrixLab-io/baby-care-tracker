import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlusIcon, PencilSquareIcon, DocumentArrowUpIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import Input from '../components/Input';
import DatePicker from '../components/DatePicker';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const AddEditBaby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBaby, updateBaby, babies, addMedicalRecord, deleteMedicalRecord } = useBaby();
  const fileInputRef = useRef(null);

  const isEdit = Boolean(id);
  const existingBaby = babies.find(baby => baby.id === id);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    photo: ''
  });

  const [errors, setErrors] = useState({});
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (isEdit && existingBaby) {
      setFormData({
        name: existingBaby.name,
        dob: existingBaby.dob,
        gender: existingBaby.gender || '',
        bloodGroup: existingBaby.bloodGroup || '',
        photo: existingBaby.photo || ''
      });
    }
  }, [isEdit, existingBaby]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      if (dob > today) {
        newErrors.dob = 'Date of birth cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadError('');

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only PDF, JPG, and PNG files are allowed');
        return;
      }
      if (file.size > maxSize) {
        setUploadError('File size must be less than 5MB');
        return;
      }
    }

    // Convert files to base64
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPendingFiles(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePendingFile = (fileId) => {
    setPendingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDeleteMedicalRecord = (recordId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      deleteMedicalRecord(recordId);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEdit) {
      updateBaby(id, formData);
      // Upload pending files for existing baby
      for (const file of pendingFiles) {
        addMedicalRecord({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file.data
        });
      }
    } else {
      const newBaby = addBaby({ ...formData, medicalRecords: pendingFiles.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        size: f.size,
        data: f.data,
        uploadedAt: new Date().toISOString()
      }))});
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="max-w-2xl mx-auto p-4 py-8 flex-1 w-full">
        {/* Header */}
        <Header showBack backLabel="Back" />

        <Card>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              {isEdit ? (
                <PencilSquareIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <UserPlusIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {isEdit ? 'Edit Baby Profile' : 'Add Baby Profile'}
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {isEdit ? 'Update your baby\'s information' : 'Enter your baby\'s information to start tracking'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Baby's Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter baby's name"
              required
              error={errors.name}
            />

            <DatePicker
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              error={errors.dob}
              placeholder="Select date of birth"
            />

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Gender (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="glass-card px-6 py-3 rounded-xl cursor-pointer hover:scale-105 transition-transform text-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">👦 Boy</span>
                </label>
                <label className="glass-card px-6 py-3 rounded-xl cursor-pointer hover:scale-105 transition-transform text-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">👧 Girl</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Blood Group (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {BLOOD_GROUPS.map(group => (
                  <label
                    key={group}
                    className={`glass-card px-3 sm:px-4 py-2 sm:py-3 rounded-xl cursor-pointer hover:scale-105 transition-transform text-center ${
                      formData.bloodGroup === group ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="bloodGroup"
                      value={group}
                      checked={formData.bloodGroup === group}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`font-medium text-sm sm:text-base ${
                      formData.bloodGroup === group
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {group}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Photo URL (Optional)"
              name="photo"
              type="url"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />

            {formData.photo && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Photo Preview:</p>
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white/50 dark:ring-gray-700/50"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Medical Records Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Medical Records (Optional)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Upload birth certificates, medical reports, prescriptions, etc. (PDF, JPG, PNG - Max 5MB each)
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="glass-card w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer flex flex-col items-center gap-2"
              >
                <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload files</span>
              </button>

              {uploadError && (
                <p className="text-sm text-red-500 mt-2">{uploadError}</p>
              )}

              {/* Pending files to upload (for new baby) */}
              {pendingFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Files to upload:</p>
                  {pendingFiles.map(file => (
                    <div key={file.id} className="glass flex items-center justify-between p-3 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <DocumentIcon className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePendingFile(file.id)}
                        className="p-1 text-red-500 hover:text-red-700 shrink-0"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing medical records (for edit mode) */}
              {isEdit && existingBaby?.medicalRecords?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded records:</p>
                  {existingBaby.medicalRecords.map(record => (
                    <div key={record.id} className="glass flex items-center justify-between p-3 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        <DocumentIcon className="w-5 h-5 text-green-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{record.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(record.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={record.data}
                          download={record.name}
                          className="p-1 text-indigo-500 hover:text-indigo-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DocumentArrowUpIcon className="w-5 h-5 rotate-180" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedicalRecord(record.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate('/')} fullWidth>
                Cancel
              </Button>
              <Button
                type="submit"
                fullWidth
                icon={isEdit ? PencilSquareIcon : UserPlusIcon}
              >
                {isEdit ? 'Update Baby' : 'Add Baby'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AddEditBaby;
