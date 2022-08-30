import React, { useState } from 'react';
import { ScrollView, View, TextInput, StyleSheet, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';

import Colors from '../../constants/Colors';
import StyledText from '../../components/UI/StyledText';
import StyledButton from '../../components/UI/StyledButton';
import * as AuthActions from '../../store/actions/auth';
import * as yup from 'yup';

const authSchema = yup.object({
  email: yup.string().required().email('email is not valid'),
  password: yup.string().required().min(6),
});

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    setIsLoading(true);
    const action = isSignUpMode
      ? AuthActions.signUp(values.email, values.password)
      : AuthActions.logIn(values.email, values.password);
    try {
      await dispatch(action);
      navigation.navigate('Stats');
    } catch (err) {
      Alert.alert('Something went wrong...', err.message || 'Please try again later.', [{ text: 'OK' }]);
      setIsLoading(false);
    }
  };

  const initialValues = { email: '', password: '' };

  return (
    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={40} style={styles.container}>
      <View>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Formik initialValues={initialValues} validationSchema={authSchema} onSubmit={onSubmit} enableReinitialize>
            {({ isSubmitting, isValid, handleChange, touched, errors, handleSubmit, values }) => (
              <View>
                <View style={styles.headerContainer}>
                  <StyledText style={styles.header}>{isSignUpMode ? 'Sign Up' : 'Log In'}</StyledText>
                </View>
                <View style={styles.fieldContainer}>
                  <View style={styles.inputContainer}>
                    <StyledText style={styles.label}>E-mail:</StyledText>
                    <TextInput
                      style={{ ...styles.textInput, borderBottomColor: errors.email ? Colors.danger : Colors.accepted }}
                      onChangeText={handleChange('email')}
                      value={values.email}
                      keyboardType='email-address'
                      placeholder='user@address.com'
                    />
                  </View>
                  {errors.email && touched.email && <StyledText style={styles.errorMessage}>{errors.email}</StyledText>}
                </View>
                <View style={styles.fieldContainer}>
                  <View style={styles.inputContainer}>
                    <StyledText style={styles.label}>Password:</StyledText>
                    <TextInput
                      style={{
                        ...styles.textInput,
                        borderBottomColor: errors.password ? Colors.danger : Colors.accepted,
                      }}
                      onChangeText={handleChange('password')}
                      value={values.password}
                      placeholder='password'
                      keyboardType='default'
                      secureTextEntry
                    />
                  </View>
                  {errors.password && touched.password && (
                    <StyledText style={styles.errorMessage}>{errors.password}</StyledText>
                  )}
                </View>
                <View style={styles.center}>
                  <StyledText style={styles.switchForm} onPress={() => setIsSignUpMode(!isSignUpMode)}>
                    {isSignUpMode ? 'Already have an account? Log In here!' : 'New user? Sign Up here!'}
                  </StyledText>
                </View>
                <StyledButton onPress={handleSubmit} disabled={!isValid || isSubmitting} isLoading={isLoading}>
                  {isSignUpMode ? 'Sign Up' : 'Log In'}
                </StyledButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Receipter',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    height: '100%',
    paddingTop: 150,
    padding: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  header: {
    color: Colors.primary,
    fontSize: Platform.OS === 'android' ? 40 : 50,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  label: {
    fontSize: Platform.OS === 'android' ? 23 : 33,
    marginRight: 15,
  },
  errorMessage: {
    color: Colors.danger,
    fontSize: Platform.OS === 'android' ? 14 : 23,
    marginLeft: 70,
  },
  textInput: {
    borderBottomColor: Colors.accepted,
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 2,
    paddingVertical: 4,
    flex: 1,
    fontSize: Platform.OS === 'android' ? 12 : 19,
  },
  switchForm: {
    color: Colors.primary,
  },
  center: {
    alignItems: 'center',
  },
});

export default AuthScreen;
