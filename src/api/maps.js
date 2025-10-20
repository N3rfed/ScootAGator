import React, { useEffect, useState, useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

const GOOGLE_MAPS_APIKEY = "AIzaSyD9lU1bVMGBm77wCVZf6jKiFGe8FB6MlX8"; // OUR API KEY

export default function Maps({ setFrom, setTo }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const mapRef = useRef();

  // REQUEST LOCATION PERMISSION AND GET CURRENT LOCATION
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(coords);
      setFrom(coords); // Update parent
    })();
  }, [setFrom]);

  // HANDLE MAP PRESS TO SET DESTINATION
  const handleMapPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setDestination(coords);
    setTo(coords); // Update parent
  };

  // RECENTER BUTTON
  const recenter = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...currentLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        ref={mapRef}
        initialRegion={{
          latitude: currentLocation?.latitude || 40.7128,
          longitude: currentLocation?.longitude || -74.006,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {currentLocation && <Marker coordinate={currentLocation} title="You" />}
        {destination && <Marker coordinate={destination} title="Destination" />}

        {currentLocation && destination && (
          <MapViewDirections
            origin={currentLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#4285F4"
            optimizeWaypoints={true}
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="⟳ My Location" onPress={recenter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 5,
    elevation: 5,
  },
});
