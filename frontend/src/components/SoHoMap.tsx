import { useEffect, useState, useRef } from "react";
import { Map, AdvancedMarker, useMap, Pin } from "@vis.gl/react-google-maps";
import { Dialog } from "./ui/dialog";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import StoreDialog from "./StoreDialog";
import type { Store } from "@/types";

export default function SoHoMap({
  stores,
  userStores,
  showOnlyUserStores,
  defaultCenter,
}: {
  stores: Store[];
  userStores: Store[];
  showOnlyUserStores: boolean;
  defaultCenter?: { lat: number; lng: number };
}) {
  const initialCenter = defaultCenter || {
    lat: 40.723115351278075,
    lng: -73.99867417832154,
  };
  const mapKey = `map-${initialCenter.lat}-${initialCenter.lng}`;

  return (
    <Map
      key={mapKey}
      defaultZoom={17}
      defaultCenter={initialCenter}
      mapId="b9b9aae2738373ca"
    >
      {showOnlyUserStores ? (
        <PoiMarkersForSelectedStores stores={userStores} />
      ) : (
        <PoiMarkers stores={stores} />
      )}
      {/* <PoiMarkers stores={stores} /> */}
    </Map>
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
  }, [map, props]);

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
            scale={0.5}
          />
        </AdvancedMarker>
      ))}
      <Dialog
        open={!!selectedStore}
        onOpenChange={(open) => !open && setSelectedStore(null)}
      >
        {selectedStore && (
          <StoreDialog store={selectedStore} allowAddRemove={true} />
        )}
      </Dialog>
    </>
  );
};

const PoiMarkersForSelectedStores = (props: { stores: Store[] }) => {
  const map = useMap();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker) {
      markersRef.current[key] = marker;
    } else {
      delete markersRef.current[key];
    }
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
            scale={0.8}
          />
        </AdvancedMarker>
      ))}
      <Dialog
        open={!!selectedStore}
        onOpenChange={(open) => !open && setSelectedStore(null)}
      >
        {selectedStore && (
          <StoreDialog store={selectedStore} allowAddRemove={true} />
        )}
      </Dialog>
    </>
  );
};
