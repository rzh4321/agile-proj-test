import { useEffect, useState, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { Dialog } from "./ui/dialog";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import useStores from "@/hooks/useStores";
import { Loader } from "lucide-react";
import StoreDialog from "./StoreDialog";
import type { Store } from "@/types";

export default function SoHoMap() {
  const { stores, loading, error } = useStores();

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader className="animate-spin w-[40px] h-[40px]" />
      </div>
    );
  }
  if (error) {
    return <div>Something went wrong when loading the map : {error}</div>;
  }

  return (
    <APIProvider
      apiKey={"AIzaSyBX6VqkGXWxsNGmZ45gHz4CGWHiRSgyhzI"}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        defaultZoom={16}
        defaultCenter={{ lat: 40.723115351278075, lng: -73.99867417832154 }}
        mapId="b9b9aae2738373ca"
      >
        <PoiMarkers stores={stores} />
      </Map>
    </APIProvider>
  );
}

const PoiMarkers = (props: { stores: Store[] }) => {
  const map = useMap();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const handleClick = (store: Store) => {
    if (!map) return;
    map.panTo({ lat: store.lat, lng: store.lng });
    setSelectedStore(store);
  };

  return (
    <>
      {props.stores.map((store: Store) => (
        <AdvancedMarker
          key={store._id}
          position={{ lat: store.lat, lng: store.lng }}
          ref={(marker) => setMarkerRef(marker, store._id as string)}
          clickable={true}
          onClick={() => handleClick(store)}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
      <Dialog
        open={!!selectedStore}
        onOpenChange={(open) => !open && setSelectedStore(null)}
      >
        {selectedStore && <StoreDialog store={selectedStore} />}
      </Dialog>
    </>
  );
};
