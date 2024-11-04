import { useEffect, useRef, memo } from "react";

interface DirectionsMapProps {
  directionResult: google.maps.DirectionsResult;
  center: google.maps.LatLngLiteral;
  zoom?: number;
}

const DirectionsMap = memo(
  ({ directionResult, center, zoom = 7 }: DirectionsMapProps) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
      null,
    );

    useEffect(() => {
      if (!mapDivRef.current) return;

      // Only create new map if it doesn't exist
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(mapDivRef.current, {
          zoom,
          center,
        });
      }

      // Initialize DirectionsRenderer if it hasn't been created yet
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(mapRef.current);
      }

      // Update directions
      directionsRendererRef.current.setDirections(directionResult);

      return () => {
        if (directionsRendererRef.current) {
          directionsRendererRef.current.setMap(null);
        }
      };
    }, [directionResult]); // Only depend on directionResult

    return <div ref={mapDivRef} style={{ width: "100%", height: "300px" }} />;
  },
);

export default DirectionsMap;
