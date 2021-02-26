import {success, failure} from '../utils/premises'
import { header, bivelAPI } from './api_adresses';
import {getItemValue, setItemValue} from '../utils/storage';


export const fetchStations = async () => {
    try{
      let infos = require('../app.json');
      let version =  infos.expo.version;
      // On envoie les infos au serveur
      const response = await fetch(bivelAPI.activity, {
        method: 'POST',
        headers: new Headers(header),
        body: JSON.stringify({
          'version': version
        })
      });

      // On récupere les données
      const json = await response.json();
      let records = json["data"];
      let news = json["news"];
      if (news.id != undefined){
        let news_seen = await getItemValue("@news");
        if (news_seen == undefined){
          news_seen = [];
        }else{
          news_seen = JSON.parse(news_seen);
        }
        if (news_seen.includes(news.id)){
          news = undefined;
        }else{
          news_seen.push(news.id);
          setItemValue("@news",JSON.stringify(news_seen));
        }
      }else{
        news = undefined;
      }
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
            "activity":fields.s_tot,
            "broken":fields.broken
        })
      }
      return success({data:stations,news:news});

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