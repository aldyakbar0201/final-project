import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  image: string;
  bgColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  image,
  bgColor,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${bgColor}`}
    >
      <div className="relative w-28 h-28 mb-2">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <h3 className="text-center font-semibold text-gray-800">{title}</h3>
    </div>
  );
};

export default CategoryCard;
