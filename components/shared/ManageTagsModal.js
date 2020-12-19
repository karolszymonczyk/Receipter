import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { orderBy, capitalize } from 'lodash';

import IconButton from '../UI/IconButton';
import StyledButton from '../UI/StyledButton';
import * as TagsActions from '../../store/actions/tags';
import * as ReceiptsActions from '../../store/actions/receipts';
import StyledText from '../UI/StyledText';
import Colors from '../../constants/Colors';

const ManageTagsModal = ({ isVisible, onClose }) => {
  const [isLoadingTrash, setIsLoadingTrash] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const allTags = useSelector((state) => orderBy(state.tags.userTags, ['key']));
  const dispatch = useDispatch();

  const [tagName, setTagName] = useState('');

  const loadTags = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(TagsActions.loadTags());
    } catch (err) {
      setError('Somethink went wrong ;/ Please try again later.');
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleClose = () => {
    setTagName('');
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoadingButton(true);
    try {
      await dispatch(TagsActions.addTag({ key: tagName.trim() }));
      setTagName('');
    } catch (err) {
      Alert.alert('Something went wrong...', 'Please try again later.', [{ text: 'OK' }]);
    }
    setIsLoadingButton(false);
  };

  // add error message when is same as existing
  // add deleting and editing tags

  // TO DODAĆ
  const handleDelete = async (id) => {
    setIsLoadingTrash(true);
    try {
      await dispatch(TagsActions.deleteTag({ id }));
      await dispatch(ReceiptsActions.removeTag({ tagId: id }));
    } catch (err) {
      Alert.alert('Something went wrong...', 'Please try again later.', [{ text: 'OK' }]);
    }
    setIsLoadingTrash(false);
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
              disabled={
                !tagName || allTags.map((tag) => tag.key.toLowerCase().trim()).includes(tagName.toLowerCase().trim())
              }
              onPress={handleSubmit}
              isLoading={isLoadingButton}
            />
          </View>
          <View style={styles.listContainer}>
            {isLoading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <ScrollView style={styles.list}>
                {allTags.map((tag) => (
                  <View key={tag.id} style={[styles.flexContainer, styles.row]}>
                    <StyledText>{capitalize(tag.key)}</StyledText>
                    <IconButton
                      icon={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                      iconSize={25}
                      onPress={() => createTwoButtonAlert(tag)}
                      isLoading={isLoadingTrash}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
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
    fontSize: Platform.OS === 'android' ? 15 : 24,
    width: 150,
    marginBottom: 10,
  },
});

export default ManageTagsModal;
