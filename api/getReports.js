import {success, failure} from './premises'
import {getItemValue} from './storage'


export const fetchReports = async () => {
    try{

      // On envoie les infos au serveur
        let email = await getItemValue("@username");
      const response = await fetch('https://theo.delemazure.fr/bivelAPI/get_report.php', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept':'Application/json'
        }),
        body: JSON.stringify({
          'email':email
        })
      });

      // On récupere les données
      const json = await response.json();
      // Si echec, on le signale à l'utilisateur
      if (json.code != 200){
        return failure({});
      }

      // Sinon  on continue
      return success({data:JSON.stringify(json)});

    }catch(e){
      return failure({ error: 503, message: "Server not reachable"});
    }
};