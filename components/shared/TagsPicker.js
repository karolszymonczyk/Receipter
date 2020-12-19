import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { capitalize, isEmpty, orderBy, reject } from 'lodash';
import { useSelector } from 'react-redux';

import TagForm from '../../components/shared/TagForm';
import StyledText from '../UI/StyledText';
import IconButton from '../UI/IconButton';
import Colors from '../../constants/Colors';

const TagsPicker = ({ selectedTags, setSelectedTags, receiptValue }) => {
  const allTags = useSelector((state) => orderBy(state.tags.userTags, ['key'])); // memoize
  const filterdTags = reject(allTags, (tag) => selectedTags.map((tag) => tag.id).includes(tag.id));

  const addTag = ({ selectedTag, value }, { resetForm }) => {
    selectedTags.reduce((acc, tag) => acc + tag.value, 0) + parseFloat(value.replace(',', '.')) > receiptValue
      ? Alert.alert('Warning', 'Sum of tags values is greater than receipt total.', [{ text: 'OK' }])
      : setSelectedTags((prevTags) => [
          ...prevTags,
          { id: selectedTag.id, key: selectedTag.key, value: parseFloat(value.replace(',', '.')) },
        ]);
    resetForm();
  };

  const initialValues = { selectedTag: filterdTags[0] || '', value: '' };

  useEffect(() => {
    if (allTags) {
      const existingTagsIds = allTags.map((el) => el.id);
      const filteredSelectedTags = selectedTags.filter((tag) => existingTagsIds.includes(tag.id));
      if (selectedTags.length !== filteredSelectedTags.length) setSelectedTags(filteredSelectedTags);
    }
  }, [allTags]);

  return (
    <>
      {!isEmpty(allTags) ? (
        <>
          <TagForm initialValues={initialValues} onSubmit={addTag} tags={filterdTags} />
          {!isEmpty(selectedTags) ? (
            selectedTags.map((tag, idx) => (
              <View
                key={idx}
                style={[styles.row, { backgroundColor: idx % 2 ? 'transparent' : 'rgba(52, 52, 52, 0.05)' }]}
              >
                <StyledText style={[styles.cell, styles.text]}>{capitalize(tag.key)}</StyledText>
                <StyledText style={[styles.cell, styles.text]}>{tag.value.toFixed(2)} PLN</StyledText>
                <IconButton
                  style={[styles.cell, styles.end]}
                  icon={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                  iconSize={30}
                  color={Colors.danger}
                  onPress={() => setSelectedTags(reject(selectedTags, (element) => element.id === tag.id))}
                />
              </View>
            ))
          ) : (
            <StyledText style={[styles.centerText, styles.text]}>No tags added</StyledText>
          )}
        </>
      ) : (
        <StyledText style={styles.message}>You must create at least one tag to mark with tags</StyledText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 1,
  },
  cell: {
    flex: 1,
    padding: 1,
    paddingHorizontal: 4,
  },
  end: {
    textAlign: 'right',
  },
  text: {
    fontSize: Platform.OS === 'android' ? 20 : 30,
  },
  centerText: {
    textAlign: 'center',
  },
  message: {
    marginTop: 30,
    marginHorizontal: 20,
    textAlign: 'center',
  },
});

export default TagsPicker;
