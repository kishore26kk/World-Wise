/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet';
import styles from './Map.module.css'
import { useCities } from '../context/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

const Map = () => {

  const {cities} = useCities();
  const [mapPosition, setMapPosition] = useState([52.53586782505711,13.376933665713324])
  const {isLoading : isLoadingPosition, position : geolocationPosition, getPosition} = useGeolocation();

  const [lat, lng] = useUrlPosition();
  useEffect(()=>{
    if(geolocationPosition){
      setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
    }
  },[geolocationPosition])

  useEffect(()=>{
    if(lat && lng) setMapPosition([lat,lng])
  },[lat, lng])

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type="position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your position"}</Button>}
      <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    {cities.map((city)=> (
    <Marker position={[city.position.lat, city.position.lng]} key={cities.id}>
      <Popup>
        <span>{city.emoji}</span> <span>{city.cityName}</span>
      </Popup>  
    </Marker>
    ))}
    <ChangeCenter position={mapPosition} />
    <DetectClick />
  </MapContainer>
    </div>
  )
}

const ChangeCenter = ({position}) => {
  const map = useMap()
  map.setView(position);
  return null;
}

const DetectClick = () =>{
  const navigate = useNavigate();

  useMapEvents({
    click : (e)=>{
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    } 
  })
}
   
export default Map