// useLocation.ts
import { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

const useLocation = (setOrigin: (coords: { latitude: number; longitude: number }) => void) => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão para acessar a localização',
            message: 'Este app precisa da sua localização para funcionar corretamente.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation();
        } else {
          Alert.alert('Permissão negada', 'A localização é necessária para usar esta funcionalidade.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrigin({ latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return { requestLocationPermission }; // retorna a função se quiser usar manualmente também
};

export default useLocation;
