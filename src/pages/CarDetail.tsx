import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Car } from '../types';
import { api } from '../utils/api';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCar(id);
    }
  }, [id]);

  const loadCar = async (carId: string) => {
    try {
      const carData = await api.getCar(carId);
      setCar(carData);
    } catch (err) {
      setError('Failed to load car details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Car not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={20} />
          Back to all cars
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={car.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={car.name}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
            <p className="text-lg text-gray-600 mb-4">
              {car.model} • {car.year}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ₹{car.price.toLocaleString()}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  car.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {car.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800`}>
                    {car.category}
                </span>
            </div>
            {car.description && (
              <p className="text-gray-700">{car.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
