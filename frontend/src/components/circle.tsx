import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { Ref } from "react";
import { GoogleMapsContext, latLngEquals } from "@vis.gl/react-google-maps";

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onRadiusChanged?: (r: ReturnType<google.maps.Circle["getRadius"]>) => void;
  onCenterChanged?: (p: ReturnType<google.maps.Circle["getCenter"]>) => void;
};

export type CircleProps = google.maps.CircleOptions & CircleEventProps;

export type CircleRef = Ref<google.maps.Circle | null>;

function useCircle(
  props: CircleProps & { enablePing?: boolean; zoom?: number },
) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
    radius,
    center,
    enablePing,
    zoom = 16,
    ...circleOptions
  } = props;

  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
  });

  const circle = useRef(new google.maps.Circle()).current;
  const pingCircle = useRef<google.maps.Circle | null>(null);

  // Update circle options
  circle.setOptions(circleOptions);

  useEffect(() => {
    if (!center) return;
    if (!latLngEquals(center, circle.getCenter())) {
      circle.setCenter(center);
      if (pingCircle.current) {
        pingCircle.current.setCenter(center);
      }
    }
  }, [center]);

  useEffect(() => {
    if (radius === undefined || radius === null) return;
    if (radius !== circle.getRadius()) {
      circle.setRadius(radius);
      if (pingCircle.current) {
        pingCircle.current.setRadius(radius);
      }
    }
  }, [radius]);

  const map = useContext(GoogleMapsContext)?.map;

  // Handle ping animation
  useEffect(() => {
    if (!map || !enablePing) return;

    if (!pingCircle.current) {
      pingCircle.current = new google.maps.Circle({
        center: center,
        radius: radius,
        strokeColor: circleOptions.strokeColor || "#1a73e8",
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: circleOptions.fillColor || "#1a73e8",
        fillOpacity: 0,
        map: map,
      });
    }

    let opacity = 0.4;
    let expanding = true;
    let currentRadius = radius || 0;
    let timeoutId: NodeJS.Timeout;

    // Calculate radius multiplier based on zoom
    const baseMultiplier = 4; // multiplier for zoom level 16
    const zoomFactor = Math.pow(1.1, 16 - (zoom || 16));
    const radiusMultiplier = baseMultiplier * zoomFactor;

    const animate = () => {
      if (!pingCircle.current) return;

      if (expanding) {
        currentRadius += (radius || 0) * 0.15;
        if (zoom >= 16) opacity -= 0.016;
        else opacity -= 0.008;

        if (currentRadius >= (radius || 0) * radiusMultiplier) {
          expanding = false;
          currentRadius = radius || 0;
          opacity = 0.4;

          // Wait 1000ms (1 second) before starting the next ping
          timeoutId = setTimeout(() => {
            expanding = true;
          }, 3000);
        }
      }

      pingCircle.current.setOptions({
        radius: currentRadius,
        fillOpacity: opacity,
      });

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeoutId);
      if (pingCircle.current) {
        pingCircle.current.setMap(null);
        pingCircle.current = null;
      }
    };
  }, [map, enablePing, center, radius, zoom]);

  // Add to map
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Circle> has to be inside a Map component.");
      return;
    }

    circle.setMap(map);

    return () => {
      circle.setMap(null);
      if (pingCircle.current) {
        pingCircle.current.setMap(null);
      }
    };
  }, [map]);

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!circle) return;

    // Add event listeners
    const gme = google.maps.event;
    [
      ["click", "onClick"],
      ["drag", "onDrag"],
      ["dragstart", "onDragStart"],
      ["dragend", "onDragEnd"],
      ["mouseover", "onMouseOver"],
      ["mouseout", "onMouseOut"],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(circle, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });
    gme.addListener(circle, "radius_changed", () => {
      const newRadius = circle.getRadius();
      callbacks.current.onRadiusChanged?.(newRadius);
    });
    gme.addListener(circle, "center_changed", () => {
      const newCenter = circle.getCenter();
      callbacks.current.onCenterChanged?.(newCenter);
    });

    return () => {
      gme.clearInstanceListeners(circle);
    };
  }, [circle]);

  return circle;
}

export type ExtendedCircleProps = CircleProps & {
  enablePing?: boolean;
  zoom?: number;
};

export const Circle = forwardRef(
  (props: ExtendedCircleProps, ref: CircleRef) => {
    const circle = useCircle(props);

    useImperativeHandle(ref, () => circle);

    return null;
  },
);
