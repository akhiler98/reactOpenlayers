import React from 'react';
import MapComponent from './MapComponent';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

function App() {
  const [unit, setUnit] = React.useState('kilometers');
  const [distance, setDistance] = React.useState(0);
  const [angle, setAngle] = React.useState(0);

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleAngleChange = (event) => {
    setAngle(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        React OpenLayers Map
      </Typography>
      <MapComponent />
      <FormControl fullWidth margin="normal">
        <InputLabel>Unit</InputLabel><br />
        <Select value={unit} onChange={handleUnitChange}>
          <MenuItem value="kilometers">Kilometers</MenuItem>
          <MenuItem value="miles">Miles</MenuItem>
          <MenuItem value="degrees">Degrees</MenuItem>
          <MenuItem value="radians">Radians</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Distance"
        type="number"
        fullWidth
        margin="normal"
        value={distance}
        onChange={handleDistanceChange}
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        label="Angle"
        type="number"
        fullWidth
        margin="normal"
        value={angle}
        onChange={handleAngleChange}
        InputProps={{ inputProps: { min: 0, max: 360 } }}
      />
    </Container>
  );
}

export default App;
