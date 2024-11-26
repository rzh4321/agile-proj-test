import { useEffect, useState, useRef } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  Pin,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { Dialog } from "./ui/dialog";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Circle } from "./circle";
import type { Marker } from "@googlemaps/markerclusterer";
import StoreDialog from "./StoreDialog";
import type { Store } from "@/types";

export default function SoHoMap({
  stores,
  type,
  userCoordinates,
  defaultCenter,
}: {
  stores: Store[];
  type: "Route Display" | "Home";
  userCoordinates?: { lat: number; lng: number };
  defaultCenter?: { lat: number; lng: number };
}) {
  const [zoom, setZoom] = useState(16);
  // base values
  const baseZoom = 16;
  const baseRadius = 20;

  // Calculate radius based on zoom
  const radius = baseRadius * Math.pow(1.9, baseZoom - zoom);

  const initialCenter = defaultCenter || {
    lat: 40.723115351278075,
    lng: -73.99867417832154,
  };
  const mapKey = `map-${initialCenter.lat}-${initialCenter.lng}`;

  return (
    <Map
      key={mapKey}
      defaultZoom={16}
      defaultCenter={initialCenter}
      mapId="b9b9aae2738373ca"
      onCameraChanged={(ev: MapCameraChangedEvent) => setZoom(ev.detail.zoom)}
    >
      <PoiMarkers stores={stores} type={type} />
      {userCoordinates && (
        <Circle
          radius={radius}
          center={userCoordinates}
          strokeColor={"#0c4cb3"}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={"#3b82f6"}
          fillOpacity={0.3}
          enablePing={true}
          zoom={zoom}
        />
      )}
    </Map>
  );
}

const PoiMarkers = (props: {
  stores: Store[];
  type: "Route Display" | "Home";
}) => {
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
            scale={0.5}
          />
        </AdvancedMarker>
      ))}
      <Dialog
        open={!!selectedStore}
        onOpenChange={(open) => !open && setSelectedStore(null)}
      >
        {selectedStore && (
          <StoreDialog
            store={selectedStore}
            allowAddRemove={props.type === "Home"}
          />
        )}
      </Dialog>
    </>
  );
};
