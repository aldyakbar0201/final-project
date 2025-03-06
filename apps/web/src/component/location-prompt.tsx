interface LocationPromptProps {
  message: string;
}

export default function LocationPrompt({ message }: LocationPromptProps) {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8">
      <p className="font-bold">Location Information</p>
      <p>{message}</p>
    </div>
  );
}
