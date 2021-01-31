import {success, failure} from './premises'


export const fetchRanking = async () => {
    try{

      // On envoie les infos au serveur
      let date = new Date();
      let monthDate =  date.getMonth() + "-" + date.getFullYear();
      const response = await fetch('https://theo.delemazure.fr/bivelAPI/ranking.php', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept':'Application/json'
        }),
        body: JSON.stringify({
          'currentMonth':monthDate
        })
      });

      // On récupere les données
      const json = await response.json();
      console.log(json);
      // Si echec, on le signale à l'utilisateur
      if (!json.success){
        return failure({ error: json["errorCode"], message: json["message"]});
      }

      // Sinon  on continue
      return success({data:JSON.stringify(json)});

    }catch(e){
      return failure({ error: 503, message: "Server not reachable"});
    }
};