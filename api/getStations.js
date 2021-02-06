import {success, failure} from '../utils/premises'
import { velibAPI, header } from './api_adresses';


export const fetchStations = async () => {
    try{

      // On envoie les infos au serveur
      const response = await fetch(velibAPI.stations, {
        method: 'GET',
        headers: new Headers(header)
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
            "place":capacity-meca-ebike,
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


