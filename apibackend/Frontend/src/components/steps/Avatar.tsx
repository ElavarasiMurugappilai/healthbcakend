interface AvatarProps {
  completedSteps: boolean[];
}

export default function Avatar({ completedSteps }: AvatarProps) {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Base Avatar */}
      <div className="w-20 h-20 rounded-full bg-yellow-200 border-4 border-gray-700 flex items-center justify-center">
        😊
      </div>

      {/* Accessories */}
      {completedSteps[0] && (
        <span className="absolute -top-2 -right-2 text-blue-600 text-xl">🎯</span>
      )}
      {completedSteps[1] && (
        <span className="absolute bottom-0 -left-2 text-red-500 text-xl">🩺</span>
      )}
      {completedSteps[2] && (
        <span className="absolute -bottom-2 right-0 text-green-600 text-xl">👟</span>
      )}
      {completedSteps[3] && (
        <span className="absolute top-0 left-0 text-indigo-500 text-xl">⌚</span>
      )}
    </div>
  );
}
