import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useUserLocation() {
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean | null>(
    null
  );
  const [turnedOnLocation, setTurnedOnLocation] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect((): any => {
    setIsLoading(true);
    checkLocation()
      .then((locationStatus) => {
        if (!locationStatus) {
          Location.requestPermissionsAsync().catch((err: any) =>
            setError(err.message)
          );
        }
        return Location.getCurrentPositionAsync().then((obj: any) => {
          const { coords } = obj;
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
          setTurnedOnLocation(true);
          setIsLoading(false);
        });
      })
      .catch((err) => setError(err.message));
    return () => checkLocation();
  }, [latitude, longitude, isLocationEnabled, turnedOnLocation]);

  async function checkLocation() {
    const checkLocationStatus = await Location.hasServicesEnabledAsync();
    setIsLocationEnabled(checkLocationStatus);
    return checkLocationStatus;
  }

  return { isLocationEnabled, isLoading, longitude, latitude, error };
}

export { useUserLocation };
