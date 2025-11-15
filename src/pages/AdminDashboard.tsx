import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car as CarIcon,
  Plus,
  Search,
  LogOut,
  Settings,
  Lock,
  Loader2,
} from 'lucide-react';
import { Car } from '../types';
import { api } from '../utils/api';
import CarCard from '../components/CarCard';
import CarModal from '../components/CarModal';
import SettingsModal from '../components/SettingsModal';
import PasswordModal from '../components/PasswordModal';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [token, setToken] = useState('');

  const [showCarModal, setShowCarModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/admin');
      return;
    }
    setToken(storedToken);
    loadCars();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [cars, search]);

  const loadCars = async () => {
    try {
      const data = await api.getCars();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!search) {
      setFilteredCars(cars);
      return;
    }
    const filtered = cars.filter(
      (car) =>
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setShowCarModal(true);
  };

  const handleEditCar = (id: string) => {
    const car = cars.find((c) => c._id === id);
    if (car) {
      setEditingCar(car);
      setShowCarModal(true);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const data = await api.deleteCar(id, token);
      alert(data.message || 'Car deleted successfully!');
      loadCars();
    } catch (error) {
      alert('Error deleting car');
      console.error('Error:', error);
    }
  };

  const handleSubmitCar = async (formData: FormData, editId?: string) => {
    try {
      if (editId) {
        const data = await api.updateCar(editId, formData, token);
        alert(data.message || 'Car updated successfully!');
      } else {
        const data = await api.addCar(formData, token);
        alert(data.message || 'Car added successfully!');
      }
      setShowCarModal(false);
      loadCars();
    } catch (error) {
      alert('Error saving car');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CarIcon size={36} />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-300 text-sm">Manage your car inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Change Password"
              >
                <Lock size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={handleAddCar}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              Add New Car
            </button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Total: {filteredCars.length} cars
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h2>
            <p className="text-gray-600 mb-6">Start by adding your first car</p>
            <button
              onClick={handleAddCar}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add New Car
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                onEdit={handleEditCar}
                onDelete={handleDeleteCar}
                isAdmin
              />
            ))}
          </div>
        )}
      </div>

      <CarModal
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
        onSubmit={handleSubmitCar}
        editCar={editingCar}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        token={token}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        token={token}
      />
    </div>
  );
}
