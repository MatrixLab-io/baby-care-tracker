import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import Input from '../components/Input';
import DatePicker from '../components/DatePicker';
import Button from '../components/Button';
import Card from '../components/Card';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const AddEditBaby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBaby, updateBaby, babies } = useBaby();

  const isEdit = Boolean(id);
  const existingBaby = babies.find(baby => baby.id === id);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    photo: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && existingBaby) {
      setFormData({
        name: existingBaby.name,
        dob: existingBaby.dob,
        gender: existingBaby.gender || '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEdit) {
      updateBaby(id, formData);
    } else {
      addBaby(formData);
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="secondary" size="sm" icon={ArrowLeftIcon} onClick={() => navigate('/')}>
            Back
          </Button>
          <ThemeToggle />
        </div>

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
