import useSavedRoutes from "@/hooks/useSavedRoutes";
import AddUpdateRouteButton from "./AddUpdateRouteButton";
import CopyLinkButton from "./CopyLinkButton";
import DeleteRouteButton from "./DeleteRouteButton";
import { Loader } from "lucide-react";

export default function SavedRoutesPage() {
  const { routes, loading, error, refetch } = useSavedRoutes();

  if (error || loading) {
    return (
      <div className="h-[calc(100vh-68px)] flex justify-center items-center">
        {error ? (
          `Error: ${error}${error.includes("token") ? ". Please log back in." : ""}`
        ) : (
          <Loader className="animate-spin w-[40px] h-[40px]" />
        )}
      </div>
    );
  }

  const savedRoutes = routes.map((route) => (
    <div
      key={route._id}
      className="flex justify-between border-2 bg-green-200 hover:bg-green-300  border-green-400 rounded-sm p-2"
    >
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-semibold">{route.name}</span>
        <div className="text-sm">{route.description}</div>
        <div className="text-xs text-wrap">
          {route.stores.slice(0, 3).map((store, i) => (
            <span key={store._id} className=" font-light">
              {store.name}
              {i === 2 && route.stores.length > 3
                ? "..."
                : i === route.stores.length - 1
                  ? ""
                  : ", "}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <CopyLinkButton routeId={route._id} />
        <AddUpdateRouteButton
          route={route}
          type="Update"
          onRouteUpdate={refetch}
        />
        <DeleteRouteButton route={route} onRouteDelete={refetch} />
      </div>
    </div>
  ));

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="text-3xl font-bold">Your Saved Routes</div>
      <div className="text-md font-light">
        View, edit, or share your saved shopping routes. Click any route to see
        its optimized path.
      </div>
      <div className="flex flex-col gap-5">
        {loading ? (
          <Loader className="animate-spin" />
        ) : savedRoutes && savedRoutes.length > 0 ? (
          savedRoutes
        ) : (
          <div className="text-center mt-10 font-poppins">
            You have no saved routes.
          </div>
        )}
      </div>
    </div>
  );
}
