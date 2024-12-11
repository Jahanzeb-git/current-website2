import React from 'react';

const sampleImages = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
  'https://images.unsplash.com/photo-1682687221038-404670f05144',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
  'https://images.unsplash.com/photo-1682687220067-dced0c5bf699'
].map(url => `${url}?auto=format&fit=crop&w=300&q=80`);

export const ImageCollage: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
      {sampleImages.map((image, index) => (
        <div
          key={index}
          className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={image}
            alt={`Sample ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
