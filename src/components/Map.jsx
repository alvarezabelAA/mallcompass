'use client'

import L from 'leaflet'
import MarkerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import MarkerShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Circle, Pane, useMap, useMapEvent } from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
function MyComponent() {
  const map = useMap()

  console.log('map center:', map.getCenter())
  return null
}

// function MapZoomClick() {
//   const center = useMap()

//   console.log(center.getCenter().lat)
//   const map = useMapEvent('click', (e) => {
//     const { lat, lng } = e.latlng;

//     map.setView([lat,lng], center.getZoom())
//   })

//   return null
// }

const Map = ({ ancho = '100%', largo='50vh' }) => {

  const [coord, setCoord] = useState([14.64072, -90.51327])

  const SearchLocation = () => {
    return (
      <div className="search-location">
        <input type="text" placeholder="Search Location" />
      </div>
    )
  }

  const GetMyLocation = () => {

    const getMyLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCoord([position.coords.latitude, position.coords.longitude])
          console.log([position.coords.latitude, position.coords.longitude])
        })
      } else {
        console.log("Geolocation is not supported by this browser.")
      }
    }

    return (
      <div className="get-my-location">
        <button onClick={getMyLocation}>Get My Location</button>
      </div>
    )
  }

  useEffect(()=>{
  },[coord])


  function MapClickEvent () {
    const center = useMap()
    const map = useMapEvent('click', (e) => {
      const { lat, lng } = e.latlng;
      console.log(lat,lng)
      map.setView([lat,lng], center.getZoom())
      setCoord([lat, lng]);
    });

    return null;
  }


  return (
    <div id="map">
      <SearchLocation />
      <GetMyLocation />
      <MapContainer style={{
        height: largo,
        width: ancho
      }} center={coord} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        {/* <MyComponent /> */}
        <Marker position={coord}
          eventHandlers={{
            click: () => {
              console.log('marker clicked')
            },
          }}
          icon={
            new L.Icon({
              iconUrl: MarkerIcon.src,
              iconRetinaUrl: MarkerIcon.src,
              iconSize: [25, 41],
              iconAnchor: [12.5, 41],
              popupAnchor: [0, -41],
              shadowUrl: MarkerShadow.src,
              shadowSize: [41, 41],
            })
          } >
          <Popup>Su coordenada es: {coord}</Popup>
          <Circle center={coord} radius={500} />
          
        </Marker>
        <MapClickEvent />
        {/* <MapZoomClick /> */}
      </MapContainer>
    </div>
  )
}

export default Map