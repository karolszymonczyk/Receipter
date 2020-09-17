import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import moment from 'moment';

const HistoryItem = (props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <TouchableComponent onPress={props.onClick} style={styles.item} useForeground>
      <View>
        <View style={styles.price}>
          <Text>{props.total.toFixed(2)} PLN</Text>
        </View>
        <Image
          style={styles.image}
          source={{
            uri:
              'https://prowly-uploads.s3.eu-west-1.amazonaws.com/uploads/8222/assets/132267/original-190120148b33da12ed35edc531508409.jpg',
          }}
        />
        <View style={styles.date}>
          <Text>{moment(props.date).format('dddd DD.MM.YY')}</Text>
        </View>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 0.5,
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    maxWidth: '48%',
    height: 130, // dynamic dodać
    margin: 4,
  },
  image: {
    width: '100%',
    height: '60%',
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 5,
    overflow: 'hidden',
  },
  date: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default HistoryItem;
