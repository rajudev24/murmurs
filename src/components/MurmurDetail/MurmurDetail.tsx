import { ArrowLeft, Heart } from 'lucide-react'
import React, { useState } from 'react'

export const MurmurDetail = (getUserById,selectedMurmur,setCurrentView,setSelectedUser) => {
  if (!selectedMurmur) return null;
  const author = getUserById(selectedMurmur.userId);
  const [likedMurmurs, setLikedMurmurs] = useState(new Set());

  const handleLike = (murmurId, e) => {
    e.stopPropagation();
    setMurmurs(prev => prev.map(murmur =>
      murmur.id === murmurId
        ? { ...murmur, likes: likedMurmurs.has(murmurId) ? murmur.likes - 1 : murmur.likes + 1 }
        : murmur
    ));

    setLikedMurmurs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(murmurId)) {
        newSet.delete(murmurId);
      } else {
        newSet.add(murmurId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentView('timeline')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Timeline</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-colors"
            onClick={() => {
              setSelectedUser(author);
              setCurrentView('userDetail');
            }}
          >
            {author?.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2
              className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                setSelectedUser(author);
                setCurrentView('userDetail');
              }}
            >
              {author?.name}
            </h2>
            <p className="text-gray-600 text-sm">{formatTimestamp(selectedMurmur.timestamp)}</p>
          </div>
        </div>

        <p className="text-gray-800 text-lg leading-relaxed mb-6">{selectedMurmur.text}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={(e) => handleLike(selectedMurmur.id, e)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              likedMurmurs.has(selectedMurmur.id)
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${likedMurmurs.has(selectedMurmur.id) ? 'fill-current' : ''}`} />
            <span className="font-medium">{selectedMurmur.likes} likes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
