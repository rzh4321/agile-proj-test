import { useEffect, useRef, memo } from "react";

type DirectionsMapProps = {
  directionResult: google.maps.DirectionsResult;
  center: google.maps.LatLngLiteral;
  zoom?: number;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
};

const DirectionsMap = memo(
  ({ directionResult, mapRef, center, zoom = 12 }: DirectionsMapProps) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
      null,
    );

    // Initialize map
    useEffect(() => {
      if (!mapDivRef.current || mapRef.current) return;

      mapRef.current = new google.maps.Map(mapDivRef.current, {
        zoom,
        center,
      });

      // Clean up
      return () => {
        mapRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array as we only want to create the map once

    // Handle directions
    useEffect(() => {
      if (!mapRef.current) return;

      // Clean up previous renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }

      // Create new renderer
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        preserveViewport: true,
        map: mapRef.current,
      });

      // Set new directions
      directionsRendererRef.current.setDirections(directionResult);

      // Clean up
      return () => {
        if (directionsRendererRef.current) {
          directionsRendererRef.current.setMap(null);
          directionsRendererRef.current = null;
        }
      };
    }, [directionResult, mapRef]);

    return <div ref={mapDivRef} style={{ width: "100%", height: "300px" }} />;
  },
);

export default DirectionsMap;
