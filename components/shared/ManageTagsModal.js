import React, { useState } from 'react';
import { View, ScrollView, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { orderBy, capitalize } from 'lodash';

import IconButton from '../UI/IconButton';
import StyledButton from '../UI/StyledButton';
import * as TagsActions from '../../store/actions/tags';
import * as ReceiptsActions from '../../store/actions/receipts';
import StyledText from '../UI/StyledText';

const ManageTagsModal = ({ isVisible, onClose }) => {
  const allTags = useSelector((state) => orderBy(state.tags.userTags, ['key']));
  const dispatch = useDispatch();

  const [tagName, setTagName] = useState('');

  const handleClose = () => {
    setTagName('');
    onClose();
  };

  const handleSubmit = () => {
    dispatch(
      TagsActions.addTag({
        id: Math.floor(Math.random() * 1000), // idk
        key: tagName,
      })
    );
    setTagName('');
  };

  // add error message when is same as existing
  // add deleting and editing tags

  const handleDelete = (id) => {
    dispatch(TagsActions.deleteTag({ id }));
    dispatch(ReceiptsActions.removeTag({ tagId: id }));
  };

  const createTwoButtonAlert = (tag) =>
    Alert.alert('Are you sure?', `Tag '${capitalize(tag.key)}' will be deleted from every receipt`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleDelete(tag.id) },
    ]);

  return (
    <Modal animationType='slide' transparent={true} visible={isVisible}>
      <View style={styles.centered}>
        <View style={styles.container}>
          <View style={styles.flexContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={setTagName}
              value={tagName}
              placeholder='Tag name'
              placeholderTextColor='lightgrey'
            />
            <IconButton
              icon='ios-add'
              iconSize={35}
              disabled={!tagName || allTags.map((tag) => tag.key).includes(tagName.toLowerCase())}
              onPress={handleSubmit}
            />
          </View>
          <View style={styles.listContainer}>
            <ScrollView style={styles.list}>
              {allTags.map((tag) => (
                <View key={tag.id} style={[styles.flexContainer, styles.row]}>
                  <StyledText>{capitalize(tag.key)}</StyledText>
                  <IconButton icon='ios-trash' iconSize={25} onPress={() => createTwoButtonAlert(tag)} />
                </View>
              ))}
            </ScrollView>
          </View>
          <StyledButton onPress={handleClose}>Close</StyledButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flexDirection: 'row',
  },
  row: {
    width: 180,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    maxHeight: '60%',
  },
  list: {
    flexGrow: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40%',
  },
  container: {
    margin: 20,
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    shadowRadius: 3,
    shadowOpacity: 0.25,
  },
  textInput: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    fontSize: 24,
    width: 150,
  },
});

export default ManageTagsModal;
