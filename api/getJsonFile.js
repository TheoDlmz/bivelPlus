import { success, failure } from '../utils/premises'
import { bivelAPI, header } from './api_adresses'


export const getJson = async (name) => {
  try {

    // On envoie les infos au serveur
    const response = await fetch(bivelAPI.jsonFiles+name, {
      method: 'GET',
      headers: new Headers(header)
    });

    // On récupere les données
    const json = await response.json();
    return success({ data: json});

  } catch (e) {
    return failure({ error: 503, message: "Server not reachable" });
  }
};