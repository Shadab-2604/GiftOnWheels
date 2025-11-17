import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { Car } from '../types';
import { api } from '../utils/api';

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [carData, settingsData] = await Promise.all([
        api.getCar(id!),
        api.getSettings()
      ]);
      
      setCar(carData);
      setWhatsappNumber(settingsData?.whatsapp || '');
    } catch (err) {
      setError('Failed to load car details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnquire = () => {
    if (!whatsappNumber) {
      alert('WhatsApp number not configured. Please contact admin.');
      return;
    }
    
    if (!car) return;
    
    const message = `Hello! I want to inquire about: ${car.name} (${car.model} ${car.year})`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Car not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to all cars
          </button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Mainlines: 'bg-green-100 text-green-800',
    Premium: 'bg-indigo-100 text-indigo-800',
    Series: 'bg-red-100 text-red-800',
    Luxury: 'bg-yellow-100 text-yellow-800',
    Electric: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to all cars</span>
            </Link>
            
            {/* Mobile Enquire Button */}
            <button
              onClick={handleEnquire}
              className="lg:hidden bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Enquire
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="lg:flex">
            {/* Image Section - Updated for full image display */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src={car.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={car.name}
                  className="w-full h-auto lg:h-full lg:object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {car.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {car.model} • {car.year} • {car.color}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[car.category]}`}>
                      {car.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      car.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-4">
                    ₹{car.price.toLocaleString()}
                  </div>
                </div>

                {/* Description */}
                {car.description && (
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{car.description}</p>
                  </div>
                )}

                {/* Specifications */}
                <div className="mb-6 lg:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Model</span>
                      <p className="font-medium text-gray-900">{car.model}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Year</span>
                      <p className="font-medium text-gray-900">{car.year}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Color</span>
                      <p className="font-medium text-gray-900">{car.color || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Category</span>
                      <p className="font-medium text-gray-900">{car.category}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Enquire Button */}
                <div className="mt-auto hidden lg:block">
                  <button
                    onClick={handleEnquire}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
                  >
                    <MessageCircle size={24} />
                    Enquire on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Enquire Button (Sticky) */}
          <div className="lg:hidden sticky bottom-0 bg-white border-t p-4">
            <button
              onClick={handleEnquire}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} />
              Enquire on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}