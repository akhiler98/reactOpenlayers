import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Draw, Modify, Snap } from 'ol/interaction';
import { LineString, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Control, defaults as defaultControls } from 'ol/control';

const calculateAngle = (point1, point2, point3) => {
  const angle1 = Math.atan2(point2[1] - point1[1], point2[0] - point1[0]);
  const angle2 = Math.atan2(point3[1] - point2[1], point3[0] - point2[0]);
  let angle = angle2 - angle1;
  if (angle < 0) angle += 2 * Math.PI;
  return (angle * 180) / Math.PI; // Convert radians to degrees
};

const calculateDistance = (point1, point2) => {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
};

const MapComponent = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [measureType, setMeasureType] = useState('distance');
  const [draw, setDraw] = useState(null);
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
        stroke: new Stroke({ color: '#ffcc33', width: 2 }),
        image: new CircleStyle({ radius: 7, fill: new Fill({ color: '#ffcc33' }) }),
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
      controls: defaultControls().extend([new Control({ element: document.createElement('div') })]),
    });

    setMap(initialMap);

    const drawInteraction = new Draw({
      source: vectorSource,
      type: 'LineString',
      style: new Style({
        fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
        stroke: new Stroke({ color: '#ffcc33', width: 2 }),
        image: new CircleStyle({ radius: 7, fill: new Fill({ color: '#ffcc33' }) }),
      }),
    });

    drawInteraction.on('drawend', (event) => {
      const coordinates = event.feature.getGeometry().getCoordinates();
      if (measureType === 'distance' && coordinates.length >= 2) {
        const dist = calculateDistance(coordinates[0], coordinates[1]);
        setDistance(dist);
      } else if (measureType === 'angle' && coordinates.length >= 3) {
        const ang = calculateAngle(coordinates[0], coordinates[1], coordinates[2]);
        setAngle(ang);
      }
    });

    initialMap.addInteraction(drawInteraction);
    setDraw(drawInteraction);

    const modifyInteraction = new Modify({ source: vectorSource });
    initialMap.addInteraction(modifyInteraction);
    initialMap.addInteraction(new Snap({ source: vectorSource }));

    return () => initialMap.setTarget(undefined);
  }, [measureType]);

  const handleMeasureTypeChange = (e) => {
    setMeasureType(e.target.value);
    if (draw) {
      draw.setActive(false);
      map.removeInteraction(draw);
    }
    const type = e.target.value === 'angle' ? 'LineString' : 'LineString';
    const newDraw = new Draw({
      source: map.getLayers().item(1).getSource(),
      type,
    });
    map.addInteraction(newDraw);
    setDraw(newDraw);
  };

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      <div>
        <label>
          Measurement Type:
          <select onChange={handleMeasureTypeChange}>
            <option value="distance">Distance</option>
            <option value="angle">Angle</option>
          </select>
        </label>
      </div>
      {measureType === 'distance' ? (
        <div>Distance: {distance.toFixed(2)} units</div>
      ) : (
        <div>Angle: {angle.toFixed(2)} degrees</div>
      )}
    </div>
  );
};

export default MapComponent;