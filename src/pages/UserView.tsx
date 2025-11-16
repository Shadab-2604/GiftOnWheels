import { useState, useEffect } from 'react';
import { Car as CarIcon, Loader2 } from 'lucide-react';
import { Car } from '../types';
import { api } from '../utils/api';
import CarCard from '../components/CarCard';
import FilterBar from '../components/FilterBar';

export default function UserView() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'new',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, filters]);

  const loadData = async () => {
    try {
      const [carsData, settingsData] = await Promise.all([
        api.getCars(),
        api.getSettings(),
      ]);
      setCars(carsData);
      setWhatsappNumber(settingsData?.whatsapp || '');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (filters.search) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((car) => car.category === filters.category);
    }

    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'low':
          return a.price - b.price;
        case 'high':
          return b.price - a.price;
        case 'old':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'new':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredCars(filtered);
  };

  const handleEnquire = (carName: string) => {
    if (!whatsappNumber) {
      alert('WhatsApp number not configured. Please contact admin.');
      return;
    }
    const message = `Hello! I want to inquire about: ${carName}`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <CarIcon size={40} />
            <h1 className="text-4xl font-bold">Gift On Wheels</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Discover your dream car from our exclusive collection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <FilterBar
          search={filters.search}
          category={filters.category}
          sort={filters.sort}
          onSearchChange={(value) => setFilters({ ...filters, search: value })}
          onCategoryChange={(value) => setFilters({ ...filters, category: value })}
          onSortChange={(value) => setFilters({ ...filters, sort: value })}
        />

        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h2>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car._id} car={car} onEnquire={handleEnquire} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
