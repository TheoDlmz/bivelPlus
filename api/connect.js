import {removeItemValue, setItemValue} from './storage'
import {getRides, getPayments} from '../rides_functions/general'
import {getStats} from '../rides_functions/stats'
import {success, failure} from './premises'

export const connect = async (email, password, save) => {
    try{

      // On envoie les infos au serveur
      const response = await fetch('https://theo.delemazure.fr/bivelAPI/getInfos.php', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept':'Application/json'
        }),
        body: JSON.stringify({
          'username': email,
          'password': password
        })
      });

      // On récupere les données
      const json = await response.json();

      // Si echec, on le signale à l'utilisateur
      if (json["code"] != 200){
        return failure({ error: json["code"], message: json["error"]});
      }

      // Sinon  on continue
      try {
          let rides_info = json["rides_info"];
          let payments_infos = (json["payments_info"]);
          let user_infos = (json["user_info"]);
          let stations_info = (json["stations_info"]);

          let data = {};
          data['email'] = email;
          data['badges'] = {};

          // On récupère quelques infos à renvoyer au serveur
          let rides = getRides(rides_info);
          let payments = getPayments(payments_infos);
          let infosDists = getStats(rides);
          let bivelInfos = json["bivelInfos"];
          let today = new Date();
          let curr_month = today.getMonth()+"-"+today.getFullYear();
          data["dist"] = [{'category' : "Total",
                          'value' : infosDists.total},
                          {'category' : "TotalMeca",
                          'value' : infosDists.totalMeca},
                          {'category' : curr_month,
                          'value' : infosDists.totalMonth},];
                        
          // On renvoit les infos mises à jour
          const responseUpdate = await fetch('https://theo.delemazure.fr/bivelAPI/updateAccount.php', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept':'Application/json'
            }),
            body: JSON.stringify(data)
          });
          const jsonUpdate = await responseUpdate.json();
          if (jsonUpdate["code"] != 200){
            return failure({ error: json["code"], message: "Account update failed"});
          }

          // Enfin, on mets à jours les infos en local

          let last_update = today.toDateString();
          await setItemValue('@last_update', last_update);
          await setItemValue('@bivel_infos', JSON.stringify(bivelInfos));
          await setItemValue('@rides_infos', JSON.stringify(rides));
          await setItemValue('@payments_infos', JSON.stringify(payments));
          await setItemValue('@user_infos', JSON.stringify(user_infos));
          await setItemValue('@stations_infos',JSON.stringify(stations_info));
          console.log("everything saved");
        } catch (e) {
          return failure({ error: 503, message: "Error while saving infos"});
      }

      // On enregistre le mot de passe et l'email en local
      if (save){
          try {
              await setItemValue('@username', email);
              await setItemValue('@password', password);

              console.log("credentials saved");
          } catch (e) {
            return failure({ error: 503, message: "Error while saving credentials"});
          }
        }
        return success();
        
      
    }catch(e){
      return failure({ error: 503, message: "Server not reachable"});
    }
};


export const deconnect = async () => {
  try{
    console.log("Removing items..?");
    await removeItemValue('@last_update');
    await removeItemValue('@rides_infos');
    await removeItemValue('@payments_infos');
    await removeItemValue('@user_infos');
    await removeItemValue('@stations_infos');
    await removeItemValue('@username');
    await removeItemValue('@password');
    await removeItemValue('@bivel_infos');
    console.log("Successfully removed items");
    return success();
  }catch(e){
    return failure();
  }
}