import {success, failure} from '../utils/premises'


export const fetchStations = async () => {
    try{

      // On envoie les infos au serveur
      const response = await fetch('https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&lang=fr&rows=1600', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept':'Application/json'
        })
      });

      // On récupere les données
      const json = await response.json();
      let records = json["records"];
      let stations = [];
      for (let i =0; i < records.length;i++){
        let fields  = records[i].fields;
        let ebike = fields.ebike;
        let meca = fields.mechanical;
        let capacity = fields.capacity;
        let geo = fields.coordonnees_geo;
        stations.push({
            "ebike":ebike,
            "meca":meca,
            "capacity":capacity,
            "geo":geo,
            "name":fields.name,
            "id_bivel":i
        })
      }
      return success({data:stations});

    }catch(e){
      return failure({ error: 503, message: "Server not reachable"});
    }
};


