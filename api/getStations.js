import {success, failure} from '../utils/premises'
import { velibAPI, header, bivelAPI } from './api_adresses';


export const fetchStations = async () => {
    try{

      // On envoie les infos au serveur
      const response = await fetch(bivelAPI.activity, {
        method: 'GET',
        headers: new Headers(header)
      });

      // On récupere les données
      const json = await response.json();
      let records = json["data"];
      let stations = [];
      for (let i =0; i < records.length;i++){
        let fields  = records[i];
        let ebike = fields.ebike;
        let meca = fields.meca;
        let capacity = fields.capacity;
        let geo = fields.geo;
        let code = fields.station_id;
        stations.push({
            "ebike":ebike,
            "meca":meca,
            "capacity":capacity,
            "place":capacity-meca-ebike,
            "geo":geo,
            "name":fields.name,
            "id_bivel":i,
            "id_station":code,
            "last_arrival":fields.last_arrival,
            "activity":fields.s_tot
        })
      }
      return success({data:stations});

    }catch(e){
      return failure({ error: 503, message: "Server not reachable"});
    }
};


export const fetchStationInfos = async (station_id) => {
  try{
    // On envoie les infos au serveur
    const response = await fetch(bivelAPI.stationInfo, {
      method: 'POST',
      headers: new Headers(header),
      body: JSON.stringify({
        'station_id': station_id
      })
    });

    // On récupere les données
    const json = await response.json();

    if (json.code != 200) {
      return failure({});
    }

    let data = json["data"];
    
    return success({data:data});

  }catch(e){
    return failure({ error: 503, message: e});
  }
};