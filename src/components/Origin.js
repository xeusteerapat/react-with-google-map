import React from 'react';
import '@reach/combobox/styles.css';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

const Origin = ({ placeholder, getOrigin, getArea }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 13.756331,
        lng: () => 100.501762,
      },
      radius: 100 * 1000,
    },
  });

  return (
    <Combobox
      onSelect={async address => {
        setValue(address, false);
        clearSuggestions();
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          getOrigin({ lat, lng });
          getArea(address);
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <ComboboxInput
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!ready}
        placeholder={placeholder}
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default Origin;
