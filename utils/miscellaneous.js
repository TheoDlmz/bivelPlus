import Toast from 'react-native-toast-message';


export function popupMessage(type,text1,text2){
    Toast.show({
        type: type,
        position: 'top',
        text1: text1,
        text2: text2,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40
      });
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}