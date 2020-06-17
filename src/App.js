import React, { useRef, useCallback, useState } from 'react';
import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import Origin from './components/Origin';
import Destination from './components/Destination';

const libraries = ['places'];

const center = {
  lat: 13.756331,
  lng: 100.501762,
};

const searchStyle = {
  position: 'absolute',
  top: '1rem',
  left: '80%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '400px',
  zIndex: '10',
  display: 'inline-block',
};

const App = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [response, setResponse] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [area, setArea] = useState('');

  const getOrigin = originValue => {
    setOrigin(originValue);
  };

  const getDestination = destinationValue => {
    setDestination(destinationValue);
  };

  const getArea = areaValue => {
    setArea(areaValue);
  };

  const mapContainerStyle = {
    width: '400px',
    height: '600px',
  };

  const mapRef = useRef();
  const onMapLoad = useCallback(map => {
    mapRef.current = map;
  }, []);

  const directionsCallback = response => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  };

  const getRoute = () => {
    if (origin !== '' && destination !== '') {
      setOrigin(origin);
      setDestination(destination);
    }
  };

  console.log('from', origin);
  console.log('to', destination);
  console.log('เขต', area);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  return (
    <div>
      <h1>Hi</h1>
      <div style={searchStyle}>
        <Origin name='origin' getOrigin={getOrigin} getArea={getArea} />
        <Destination name='destination' getDestination={getDestination} />
        <button onClick={getRoute}>Get Route</button>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        onLoad={onMapLoad}
      >
        {destination !== '' && origin !== '' && (
          <DirectionsService
            options={{
              destination,
              origin,
              travelMode: 'DRIVING',
            }}
            callback={directionsCallback}
          />
        )}
        {response !== null && (
          <DirectionsRenderer
            options={{
              directions: response,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default App;
