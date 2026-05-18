// src/services/PlaceMap.jsx

import { GoogleMap, Marker } from '@react-google-maps/api';
import bananaIcon from '../../assets/loading-spinner.png'; // 예시

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  mapTypeControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
};

const PlaceMap = ({ coordinates, markers, zoom, children}) => {
  // 마커 아이콘 옵션 (크기 30×30)
  const bananaIconObject = {
    url: bananaIcon,
    scaledSize: new window.google.maps.Size(30, 30),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(15, 15),
  };


  
  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={zoom}
        options={mapOptions}
      >
        {/* 도시 중심 마커 */}
        <Marker position={coordinates} icon={bananaIconObject} />

        {/* 찜한 마커들 */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={bananaIconObject}
            onClick={marker.onClick}
          />
        ))}
        {children}
      </GoogleMap>
    </div>
  );
};

export default PlaceMap;
