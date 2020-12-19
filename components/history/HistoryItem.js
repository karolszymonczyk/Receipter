import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import StyledText from '../UI/StyledText';
import moment from 'moment';

const HistoryItem = (props) => {
  const [logoError, setLogoError] = useState(false);
  let TouchableComponent = TouchableOpacity;

  // if (Platform.OS === 'android' && Platform.Version >= 21) { // jeszcze było w label
  //   TouchableComponent = TouchableNativeFeedback;
  // }
  // usunąć polskie znaki ze wszystkiego

  return (
    <TouchableComponent onPress={props.onClick} style={styles.item} useForeground>
      <View>
        <View style={styles.price}>
          <StyledText>{props.total.toFixed(2)} PLN</StyledText>
        </View>
        <View style={styles.titleContainer}>
          <StyledText numberOfLines={1}>{props.title}</StyledText>
        </View>
        <View>
          {logoError ? (
            <View style={styles.textLogoContainer}>
              <StyledText style={styles.textLogo} numberOfLines={2}>
                {props.company}
              </StyledText>
            </View>
          ) : (
            <Image
              style={styles.logo}
              source={{
                uri: `https://logo.clearbit.com/${props.company}.com?size=500`,
              }}
              onError={() => setLogoError(true)}
            />
          )}
        </View>
        <View style={styles.date}>
          <StyledText>{moment(props.date).format('ddd DD.MM.YYYY')}</StyledText>
        </View>
      </View>
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  textLogoContainer: {
    height: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLogo: {
    fontSize: Platform.OS === 'android' ? 40 : 50,
  },
  titleContainer: {
    marginLeft: 5,
    maxWidth: '100%',
  },
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
    height: 180, // dynamic dodać 150 iOS, 180 Andek
    margin: 4,
  },
  logo: {
    width: '100%',
    height: '70%',
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 5,
    overflow: 'hidden',
  },
  date: {
    marginTop: -20,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default HistoryItem;
