import { Car } from '../types';
import { MessageCircle } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onEnquire?: (carName: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function CarCard({ car, onEnquire, onEdit, onDelete, isAdmin }: CarCardProps) {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-amber-100 text-amber-800',
  };

  const categoryColors = {
    Sedan: 'bg-green-100 text-green-800',
    SUV: 'bg-indigo-100 text-indigo-800',
    Sports: 'bg-red-100 text-red-800',
    Luxury: 'bg-yellow-100 text-yellow-800',
    Electric: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden h-56">
        <img
          src={car.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rarityColors[car.rarity]}`}>
            {car.rarity.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {car.model} • {car.year}
        </p>

        <div className="flex gap-2 mb-4 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[car.category]}`}>
            {car.category}
          </span>
          {isAdmin && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              car.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {car.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        <div className="text-2xl font-bold text-gray-900 mb-4">₹{car.price.toLocaleString()}</div>

        {isAdmin ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(car._id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(car._id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onEnquire?.(car.name)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Enquire on WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}
