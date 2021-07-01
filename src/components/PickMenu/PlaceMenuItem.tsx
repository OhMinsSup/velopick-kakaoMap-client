import React, { useCallback } from "react";
import { BiX } from "react-icons/bi";
import { PlaceState, usePlacesClearState } from "../../atoms/placeState";

interface PlaceMenuItemProps {
  place: PlaceState;
}
const PlaceMenuItem: React.FC<PlaceMenuItemProps> = ({ place }) => {
  const { remove } = usePlacesClearState();
  const onClick = useCallback(() => {
    const win = window.open(place.place_url, "_blank");
    if (!win) return;
    win.focus();
  }, []);

  const onRemove = useCallback(() => {
    remove(place.id);
  }, []);

  return (
    <article className="p-4 flex space-x-4">
      <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
        <h2
          className="text-lg font-semibold text-black mb-0.5 underline cursor-pointer"
          onClick={onClick}
        >
          {place.place_name}
        </h2>
        <dl className="flex flex-wrap text-sm font-medium whitespace-pre">
          <div>
            <dt className="sr-only">Difficulty</dt>
            <dd>{place.address_name}</dd>
          </div>
          <div className="flex-none w-full mt-0.5 font-normal">
            <dd className="inline text-black">{place.category_name}</dd>
          </div>
          <div
            onClick={onRemove}
            className="absolute top-0 right-0 rounded-full cursor-pointer bg-amber-50 px-2 py-0.5 hidden sm:flex xl:flex items-center space-x-1"
          >
            <dt className="text-red-500">
              <BiX />
            </dt>
          </div>
        </dl>
      </div>
    </article>
  );
};

export default PlaceMenuItem;
