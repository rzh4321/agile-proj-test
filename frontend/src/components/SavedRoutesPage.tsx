import useSavedRoutes from "@/hooks/useSavedRoutes";
import AddUpdateRouteButton from "./AddUpdateRouteButton";
import CopyLinkButton from "./CopyLinkButton";
import DeleteRouteButton from "./DeleteRouteButton";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SavedRoutesPage() {
  const navigate = useNavigate();
  const { routes, loading, error, refetch } = useSavedRoutes();

  if (error || loading) {
    return (
      <div
        style={{
          height: "calc(100vh - 68px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error ? (
          `Error: ${error}${error.includes("JWT") ? ". Please log back in." : ""}`
        ) : (
          <Loader
            style={{
              animation: "spin 1s linear infinite",
              width: "40px",
              height: "40px",
            }}
          />
        )}
      </div>
    );
  }

  const savedRoutes = routes.map((route) => (
    <div
      key={route._id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        border: "2px solid green",
        backgroundColor: "#a7f3d0",
        padding: "8px",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#86efac";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#a7f3d0";
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "90%",
        }}
        onClick={() => navigate(`/route/${route._id}`)}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {route.name}
        </span>
        <div style={{ fontSize: "14px" }}>{route.description}</div>
        <div style={{ fontSize: "12px", wordWrap: "break-word" }}>
          {route.stores.slice(0, 3).map((store, i) => (
            <span
              key={store._id}
              style={{
                fontWeight: "300",
              }}
            >
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          justifyContent: "center",
        }}
      >
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
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Your Saved Routes
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: "300",
        }}
      >
        View, edit, or share your saved shopping routes. Click any route to see
        its optimized path.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {loading ? (
          <Loader style={{ animation: "spin 1s linear infinite" }} />
        ) : savedRoutes && savedRoutes.length > 0 ? (
          savedRoutes
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            You have no saved routes.
          </div>
        )}
      </div>
    </div>
  );
}
