import React from 'react';
import { View, StyleSheet } from 'react-native';
import { capitalize, isEmpty, orderBy, reject } from 'lodash';
import { useSelector } from 'react-redux';

import TagForm from '../../components/shared/TagForm';
import StyledText from '../UI/StyledText';
import IconButton from '../UI/IconButton';
import Colors from '../../constants/Colors';

const TagsPicker = ({ selectedTags, setSelectedTags }) => {
  const allTags = useSelector((state) => orderBy(state.tags.userTags, ['key'])); // memoize
  const filterdTags = reject(allTags, (tag) => selectedTags.map((tag) => tag.id).includes(tag.id));

  const addTag = ({ selectedTag, value }, { resetForm }) => {
    setSelectedTags((prevTags) => [
      ...prevTags,
      { id: selectedTag.id, key: selectedTag.key, value: parseFloat(value.replace(',', '.')) },
    ]);
    resetForm();
  };

  const initialValues = { selectedTag: filterdTags[0] || '', value: '' };

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
                  icon='ios-trash'
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
    fontSize: 30,
  },
  centerText: {
    textAlign: 'center',
  },
});

export default TagsPicker;
