import { Link } from "lucide-react";
import { useState } from "react";

export default function CopyLinkButton({ routeId }: { routeId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleCopy = () => {
    setIsAdding(true);
    navigator.clipboard.writeText(`http://localhost:5173/route/${routeId}`);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return isAdding ? (
    <span className="text-sm m-auto h-[30px] w-[30px] relative right-4 top-1">
      Copied!
    </span>
  ) : (
    <Link
      onClick={handleCopy}
      width={30}
      height={30}
      className="rounded-sm border-green-300 p-1 cursor-pointer"
    />
  );
}
