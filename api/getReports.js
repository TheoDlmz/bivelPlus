import { success, failure } from '../utils/premises'
import { getItemValue } from '../utils/storage'
import { bivelAPI, header} from './api_adresses'

export const fetchReports = async () => {
  try {

    // On envoie les infos au serveur
    let email = await getItemValue("@username");
    const response = await fetch(bivelAPI.myReports, {
      method: 'POST',
      headers: new Headers(header),
      body: JSON.stringify({
        'email': email
      })
    });

    // On récupere les données
    const json = await response.json();
    // Si echec, on le signale à l'utilisateur
    if (json.code != 200) {
      return failure({});
    }

    // Sinon  on continue
    return success({ data: JSON.stringify(json) });

  } catch (e) {
    return failure({ error: 503, message: "Server not reachable" });
  }
};