import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ query, onChange, placeholder }) => {
  return (
    <View style={styles.searchBar}>
      <Ionicons style={styles.icon} name='ios-search' size={23} color='black' />
      <TextInput style={styles.textInput} onChangeText={onChange} value={query} placeholder={placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 2,
    paddingVertical: 4,
    flex: 1,
  },
});

export default SearchBar;
