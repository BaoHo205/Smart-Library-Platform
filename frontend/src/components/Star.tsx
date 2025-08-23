import { Star } from 'lucide-react';

export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="h-5 w-5 fill-yellow-400 text-yellow-400"
      />
    );
  }

  // Half star
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative h-5 w-5">
        <Star className="absolute h-5 w-5 text-gray-300" />
        <div className="w-1/2 overflow-hidden">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </div>
      </div>
    );
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      {/* <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span> */}
    </div>
  );
};
