import useAuth from "@/context/AuthContext";
import UpdateSavedRouteButton from "./UpdateSavedRouteButton";
import { Loader } from "lucide-react";

export default function SavedRoutesPage() {
  const { user, loading } = useAuth();
    console.log(user, loading)
  const savedRoutes = user?.routes.map((route) => (
    <div
      key={route.id}
      className="flex justify-between border-2 bg-green-100 hover:bg-green-200  border-green-300 rounded-sm p-2"
    >
      <div className="flex flex-col gap-2">
        <span className="text-2xl">{route.name}</span>
        <div className="text-xs text-wrap">
          {route.stores.slice(0, 3).map((store, i) => (
            <span key={store._id}>
              {store.name}, {i === 2 && route.stores.length > 3 ? "..." : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 my-auto">
        <span>link</span>
        <UpdateSavedRouteButton route={route} />
        <span>delete</span>
      </div>
    </div>
  ));

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-8">Your Saved Routes</div>
      <div className="flex flex-col gap-5">{loading ? <Loader className="animate-spin m-auto" /> : savedRoutes}</div>
    </div>
  );
}
