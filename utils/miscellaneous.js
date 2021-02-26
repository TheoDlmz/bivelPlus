import Toast from 'react-native-toast-message';

// Cette fonction affiche un popup en haut de l'écran avec une info/erreur/success
export function popupMessage(type, text1, text2) {
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

// Fonction sleep toute bête
export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// Ajoute un zéro aux mois/jours < 10
export function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function getCurrentDate() {
  let d = new Date();
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}