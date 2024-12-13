import { Check, Copy, Link } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { FRONTEND_URL } from "@/config";

export default function CopyLinkButton({ routeId }: { routeId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const location = useLocation();
  const isSavedRoutesPage = location.pathname === "/saved-routes";

  const handleCopy = (
    e:
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setIsAdding(true);
    navigator.clipboard.writeText(`${FRONTEND_URL}/route/${routeId}`);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  // isAdding && isSavedRoutesPage
  return isAdding && isSavedRoutesPage ? (
    <span className="text-sm h-[30px] w-[30px] relative right-4 top-1">
      Copied!
    </span>
  ) : isSavedRoutesPage ? (
    <Link
      onClick={handleCopy}
      width={30}
      height={30}
      className="rounded-sm border-green-300 p-1 cursor-pointer"
    />
  ) : (
    <Button
      variant={"outline"}
      size={"sm"}
      className="gap-1 mt-1"
      onClick={handleCopy}
    >
      {isAdding ? (
        <>
          <Check height={20} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy height={20} />
          <span>Share</span>
        </>
      )}
    </Button>
  );
}
