import type { TravelMode } from "@/types";

export default function DirectionsPanel({
  directions,
  mode,
}: {
  directions: google.maps.DirectionsResult;
  mode: TravelMode;
}) {
  if (!directions.routes[0]) return null;

  const route = directions.routes[0];

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {route.legs.map((leg, legIndex) => (
        <div key={legIndex} className="mb-4">
          <div className="mb-2 border-2 p-1 py-2 flex gap-1 items-center bg-gray-200 border-gray-300">
            <img src="/AMarker.svg" height={30} width={30} alt="Start" />
            <span className="font-semibold text-sm">{leg.start_address}</span>
          </div>
          <span className="font-poppins">
            {leg.distance!.text}. About {leg.duration!.text} by{" "}
            {mode.toLowerCase()}
          </span>
          <div className="border-b border-gray-200 last:border-b-0 mb-2"></div>

          {leg.steps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className="mb-2 flex gap-3 pb-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="font-extralight">{stepIndex + 1}.</span>
              <div>
                <div
                  dangerouslySetInnerHTML={{ __html: step.instructions }}
                  className="mb-1 text-sm"
                />
                <div className="text-xs text-gray-600">
                  {step.distance?.text} - {step.duration?.text}
                </div>
              </div>
            </div>
          ))}
          <div className="border-2 p-1 py-2 flex gap-1 items-center bg-gray-200 border-gray-300">
            <img src="/BMarker.svg" height={30} width={30} alt="End" />
            <span className="font-semibold text-sm">{leg.end_address}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
