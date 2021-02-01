import AsyncStorage from '@react-native-community/async-storage';

export const getItemValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setItemValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    return null;
  }
};


export const removeItemValue = async (key) => {
  try {
      await AsyncStorage.removeItem(key);
      return true;
  }
  catch(exception) {
      return false;
  }
}