import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { capitalize } from 'lodash';

import Categories from '../../constants/Categories';

const CategoryPicker = ({ selected, onChange }) => {
  return (
    <Picker
      selectedValue={selected}
      onValueChange={(itemValue) => onChange(itemValue)}
      // mode='dropdown' // for android (dropdown, dialog)
    >
      {Object.values(Categories).map((category) => (
        <Picker.Item key={category} label={capitalize(category)} value={category} />
      ))}
    </Picker>
  );
};

export default CategoryPicker;
