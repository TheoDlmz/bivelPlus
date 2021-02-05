import { removeItemValue, setItemValue } from '../utils/storage'
import { getRides, getPayments } from '../utils/general'
import { getStats } from '../utils/stats'
import { success, failure } from '../utils/premises'
import { bivelAPI, header } from './api_adresses'

export const connect = async (email, password, save) => {
  try {

    // On envoie les infos au serveur
    const response = await fetch(bivelAPI.connect, {
      method: 'POST',
      headers: new Headers(header),
      body: JSON.stringify({
        'username': email,
        'password': password
      })
    });

    // On récupere les données
    const json = await response.json();

    // Si echec, on le signale à l'utilisateur
    if (json["code"] != 200) {
      return failure({ error: json["code"], message: json["error"] });
    }

    // Sinon  on continue
    try {
      let rides_info = json["rides_info"];
      let payments_infos = json["payments_info"];
      let user_infos = json["user_info"];
      let stations_info = json["stations_info"];

      let data = {};
      data['email'] = email;
      data['badges'] = {};

      // On récupère quelques infos à renvoyer au serveur
      let rides = getRides(rides_info);
      let payments = getPayments(payments_infos);
      let infosDists = getStats(rides);

      let bivelInfos = json["bivelInfos"];

      let today = new Date();
      let curr_month = today.getMonth() + "-" + today.getFullYear();

      data["dist"] = [{
        'category': "Total",
        'value': infosDists.total
      },
      {
        'category': "TotalMeca",
        'value': infosDists.totalMeca
      },
      {
        'category': curr_month,
        'value': infosDists.totalMonth
      },];

      // On renvoit les infos mises à jour
      const responseUpdate = await fetch(bivelAPI.update, {
        method: 'POST',
        headers: new Headers(header),
        body: JSON.stringify(data)
      });

      const jsonUpdate = await responseUpdate.json();

      if (jsonUpdate["code"] != 200) {
        return failure({ error: json["code"], message: "Echec lors de la mise à jour" });
      }

      // Enfin, on mets à jours les infos en local

      let last_update = today.toDateString();
      await setItemValue('@last_update', last_update);
      await setItemValue('@bivel_infos', JSON.stringify(bivelInfos));
      await setItemValue('@rides_infos', JSON.stringify(rides));
      await setItemValue('@payments_infos', JSON.stringify(payments));
      await setItemValue('@user_infos', JSON.stringify(user_infos));
      await setItemValue('@stations_infos', JSON.stringify(stations_info));

    } catch (e) {
      return failure({ error: 42, message: "Echec pendant la sauvegarde" });
    }

    // On enregistre le mot de passe et l'email en local

    try {
      await setItemValue('@username', email);
      await setItemValue('@password', password);
    } catch (e) {
      return failure({ error: 42, message: "Echec pendant la sauvegarde" });
    }

    return success();


  } catch (e) {
    return failure({ error: 503, message: "Server not reachable" });
  }
};


export const deconnect = async () => {
  try {
    await removeItemValue('@last_update');
    await removeItemValue('@rides_infos');
    await removeItemValue('@payments_infos');
    await removeItemValue('@user_infos');
    await removeItemValue('@stations_infos');
    await removeItemValue('@username');
    await removeItemValue('@password');
    await removeItemValue('@bivel_infos');
    return success();
  } catch (e) {
    return failure();
  }
}