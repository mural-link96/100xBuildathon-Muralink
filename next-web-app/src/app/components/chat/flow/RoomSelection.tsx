// src/app/components/chat/flow/RoomSelection.tsx
'use client';

import React from 'react';
import { Sofa, Bed, ChefHat, Bath, UtensilsCrossed, MapPin, Users, Baby, TreePine, LucideIcon, ArrowLeft } from 'lucide-react';
import { FadeInUp, ScaleIn } from '../../common/animations';

interface RoomType {
  name: string;
  icon: LucideIcon;
  description?: string;
}

interface RoomSelectionProps {
  onSelectRoom: (roomName: string) => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const ROOM_TYPES: RoomType[] = [
  { 
    name: 'Living Room', 
    icon: Sofa,
    description: 'Create a welcoming space for relaxation'
  },
  { 
    name: 'Bedroom', 
    icon: Bed,
    description: 'Design your perfect sleep sanctuary'
  },
  { 
    name: 'Kitchen', 
    icon: ChefHat,
    description: 'Build a functional culinary workspace'
  },
  { 
    name: 'Bathroom', 
    icon: Bath,
    description: 'Transform into a spa-like retreat'
  },
  { 
    name: 'Dining Room', 
    icon: UtensilsCrossed,
    description: 'Create memorable dining experiences'
  },
  { 
    name: 'Hallway', 
    icon: MapPin,
    description: 'Make a striking first impression'
  },
  { 
    name: 'Guest Room', 
    icon: Users,
    description: 'Welcome visitors in comfort'
  },
  { 
    name: "Children's Room", 
    icon: Baby,
    description: 'Create a playful learning environment'
  },
  { 
    name: 'Outdoor Deck', 
    icon: TreePine,
    description: 'Extend your living space outdoors'
  }
];

const RoomCard: React.FC<{
  room: RoomType;
  onSelect: (roomName: string) => void;
  index: number;
}> = ({ room, onSelect, index }) => {
  const IconComponent = room.icon;

  return (
    <ScaleIn delay={index * 100}>
      <div
        onClick={() => onSelect(room.name)}
        className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-200 hover:-translate-y-2"
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-4 text-gray-700 group-hover:text-indigo-600 transition-colors group-hover:scale-110 transform duration-300">
            <IconComponent className="w-8 h-8 md:w-10 md:h-10 mx-auto" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
          {room.description && (
            <p className="text-xs md:text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {room.description}
            </p>
          )}
        </div>
      </div>
    </ScaleIn>
  );
};

const RoomSelection: React.FC<RoomSelectionProps> = ({
  onSelectRoom,
  onBack,
  title = "Let's get to know your space",
  subtitle = "What type of space are you planning to redesign?",
  className = ''
}) => {
  return (
    <div className={`flex-1 flex items-center justify-center px-4 py-8 lg:p-12 ${className}`}>
      <div className="max-w-6xl w-full">
        {/* Back button */}
        {onBack && (
          <FadeInUp>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors mb-8 hover:translate-x-1 transform duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </FadeInUp>
        )}

        <div className="text-center mb-8 md:mb-12">
          <FadeInUp delay={100}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              {title}
            </h1>
          </FadeInUp>
          <FadeInUp delay={200}>
            <p className="text-md md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {ROOM_TYPES.map((room: RoomType, index: number) => (
            <RoomCard
              key={index}
              room={room}
              onSelect={onSelectRoom}
              index={index}
            />
          ))}
        </div>

        <FadeInUp delay={800}>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Tip: Choose the room you'd like to transform first. You can always design more rooms later!
            </p>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
};

export default RoomSelection;