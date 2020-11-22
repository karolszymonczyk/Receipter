import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// show hints on camera screen how to take proper photo (black bacground, all receipts corners visible)

const verifyCameraPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
  if (result.status !== 'granted') {
    Alert.alert('Permissions error', 'You need to grant camera permissions to scan receipt', [{ text: 'OK' }]);
    return false;
  }
  return true;
};

const takeImage = async ({ navigation }) => {
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

export default takeImage;
