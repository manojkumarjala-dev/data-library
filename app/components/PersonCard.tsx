import { FunctionComponent } from "react";

interface PersonCardProps {
  imageUrl?: string;
  name: string;
  role: string;
}

const PersonCard: FunctionComponent<PersonCardProps> = ({ imageUrl, name, role }) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg">
      {/* Profile Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          className="w-40 h-40 rounded-full object-cover border border-gray-200 bg-blue-50"
        />
      ) : (
        <div className="w-40 h-40 rounded-full border border-gray-200 bg-blue-50"></div>
      )}

      {/* Name */}
      <h3 className="mt-4 text-xl font-bold text-blue-600">{name}</h3>

      {/* Role */}
      <p className="text-lg text-gray-600">{role}</p>
    </div>
  );
};

export default PersonCard;
