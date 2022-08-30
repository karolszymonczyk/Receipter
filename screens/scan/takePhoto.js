import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


const verifyCameraPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
  if (result.status !== 'granted') {
    Alert.alert('Permissions error', 'You need to grant camera permissions to scan receipt', [{ text: 'OK' }]);
    return false;
  }
  return true;
};

const takePhoto = async ({ navigation }) => {
  const permissions = await verifyCameraPermissions();
  if (!permissions) {
    return;
  }
  const image = await ImagePicker.launchCameraAsync({
    quality: 1,
  });

  if (image.cancelled) {
    return;
  }

  navigation.navigate('Verify', { image });
};

export default takePhoto;
