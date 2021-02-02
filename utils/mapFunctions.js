
import {Heatmap, Marker, Polyline} from 'react-native-maps';
import {View} from 'react-native';
import * as React from 'react';
import { Icon } from 'react-native-elements'
import {AnimatedPolyline} from '../components/mapsComponents'

export function getFavoriteStations(rides){
	var dico_s = {};
	for (let i=0;i< rides.length;i++){
		
		let r = rides[i];
		if ((r.stationStart != "0") && (r.stationStart != r.stationEnd)){
			if (dico_s[r.stationStart] == undefined){
				dico_s[r.stationStart] = {};
				dico_s[r.stationStart]['start'] = 0;
				dico_s[r.stationStart]['end'] = 0;
			}
			dico_s[r.stationStart]['start'] += 1;
			if (dico_s[r.stationEnd] == undefined){
				dico_s[r.stationEnd] = {};
				dico_s[r.stationEnd]['start'] = 0;
				dico_s[r.stationEnd]['end'] = 0;
			}
			dico_s[r.stationEnd]['end'] += 1;
			
		}
	}
		var tab_total = [];
		for (var station in dico_s) {
			var n_tot = dico_s[station]['start'] +dico_s[station]['end'];
				tab_total.push([n_tot,station]);
		}
		tab_total.sort((a, b) => a[0] - b[0]).reverse();
		return {"total":tab_total,"dico":dico_s}
		
}

export function getFavoriteRoutes(rides){
	var dico_s = {};
	for (let i=0;i< rides.length;i++){
		
		let r = rides[i];
		if ((r.stationStart != "0") && (r.stationStart != r.stationEnd)){
			let minStation = Math.min(r.stationStart,r.stationEnd);
			let maxStation = Math.max(r.stationStart,r.stationEnd);
			let route_id = minStation+"."+maxStation;
			if (dico_s[route_id] == undefined){
				dico_s[route_id]= 0;
			}
			dico_s[route_id] += 1;
			
		}
	}
		var tab_total = [];
		for (var route in dico_s) {
			var n_tot = dico_s[route];
			tab_total.push([n_tot,route]);
		}
		
		tab_total.sort((a, b) => a[0] - b[0]).reverse();
		return tab_total
		
}


export function getAllDays(rides){
	var route_day = [];
	var day = 0;
	var date = new Date(rides[day].date);
	var time = (date.getTime()/1000-6*3600);
	var start_day = (time-time%(24*3600)+2*3600);
	var date_0 = new Date(start_day*1000);
	let month = date_0.getMonth()+1;
	if (month < 10){
		month = "0"+month;
	}
	route_day.push(date_0.getDate()+"/"+(month)+"/"+date_0.getFullYear());
	for (let i = day;i < rides.length;i++){
		if (rides[i].stationStart == "0"){
			break;
		}
		if (rides[i].stationStart == rides[i].stationEnd){
			continue;
		}
		
		var date = new Date(rides[i].date);
		var date_i =  date.getTime()/1000;
		if (date_i < start_day){
			var time = (date.getTime()/1000-6*3600);
			var start_day = (time-time%(24*3600)+2*3600);
			var date_0 = new Date(start_day*1000);
			let month = date_0.getMonth()+1;
			if (month < 10){
				month = "0"+month;
			}
			route_day.push(date_0.getDate()+"/"+(month)+"/"+date_0.getFullYear());
		}
	}
	return route_day;
}

export function getRidesOfDay(rides, target_day){
	var route_day = [];
	var passed = false;
	for (let i = 0;i < rides.length;i++){
		if (rides[i].stationStart == "0"){
			break;
		}
		if (rides[i].stationStart == rides[i].stationEnd){
			continue;
		}
		var date = new Date(rides[i].date);
		var time = (date.getTime()/1000-6*3600);
		var start_day = (time-time%(24*3600)+2*3600);
		var date_0 = new Date(start_day*1000);
		let month = date_0.getMonth()+1;
		if (month < 10){
			month = "0"+month;
		}
		let curr_day = (date_0.getDate()+"/"+(month)+"/"+date_0.getFullYear());
		if ((curr_day != target_day) && (passed)){
			break;
		}
		if (curr_day == target_day){
			passed = true;
			route_day.push(rides[i]);


		}
	}
	return route_day;
}


export const markerStation = (elem, stations) =>
{
  let id = elem[1];
  let coord = stations[id];
  let nbUse = Math.min(elem[0],50);
  let alpha = 0.3+nbUse*0.5/50;

  return (
    <Marker
      coordinate={{
        latitude:coord[1],
        longitude:coord[2],
      }}
      anchor={{x: .5, y: .5}}
    >
      <View
        style={{width:15,height:15,borderRadius:15,backgroundColor:"rgba(230, 74, 30,"+alpha+")"}}
      />
    </Marker>
  )
}

export const lineRides = (elem, stations) =>
{
  let idRoute = elem[1].split(".");
  let idOrigin = idRoute[0];
  let idDest = idRoute[1];

  let coordOrigin = stations[idOrigin];
  let coordDest = stations[idDest]

  let nbUse = Math.min(elem[0],20);
  let alpha = 0.3+nbUse*0.5/20;

  let origin={
    latitude:coordOrigin[1],
    longitude:coordOrigin[2],
  }
  let dest={
    latitude:coordDest[1],
    longitude:coordDest[2],
  }

  return (<Polyline
          coordinates={[origin,dest]}
          strokeWidth={2}
          strokeColor={"rgba(230, 74, 30,"+alpha+")" }
          lineDashPattern={[5,1]}
        />)

}

export function trajet(debut, fin, length){
	let tab_trajet = [];
	for (let i=0; i <= length; i++){
		let lat = debut.latitude + (fin.latitude - debut.latitude)*i/length;
		let lon = debut.longitude + (fin.longitude - debut.longitude)*i/length;
		tab_trajet.push({latitude:lat, longitude:lon});
	}
	return tab_trajet;
}

export const lineRidesDay = (ride, homes) =>
{
  let coordOrigin = ride.origin;
  let coordDest = ride.dest;
  let origin={
    latitude:coordOrigin[1],
    longitude:coordOrigin[2],
  }
  let dest={
    latitude:coordDest[1],
    longitude:coordDest[2],
  }
  let this_trajet = trajet(origin,dest,50);
  let colorLine;
  if (ride.isride){
    colorLine = "rgba(230, 74, 30, 1)";
  }else{
    colorLine = "rgba(200,200,200,0.6)";
  }


  return (
		<View>
			<AnimatedPolyline
			coordinates={this_trajet}
			strokeWidth={4}
			strokeColor={colorLine }
			lineDashPattern={[5,1]}
			interval={20}
			delay={500+ride.number*50*25}
			id={ride.idride}
			/>
			{homes.map((e) => home_marker(e))
			}
		</View>)


}


const home_marker = (e) => {

	let size = 15;
	let opacity = 0.5;
	if (e.current){
		size = 25;
		opacity = 1;
	}
	return (<Marker
		coordinate={{
		  latitude:e['lat'],
		  longitude:e['lon'],
		}}
		anchor={{x: .5, y: .5}}
	  >
		  {!e.seen &&
		 <Icon name="home" 
                        type='material-community'
						color="black" 
						opacity={opacity}
                        size={size} />
		  }
	  </Marker>);
}
export const HeatmapStations = (stationsPoints, homes) => {
	return (
		<View>
	  <Heatmap
		points={stationsPoints}
		radius={40}
		gradient={{
		  colors:["rgba(0,0,0,0)",
				  "rgba(230, 105, 71,0.7)",
				  "rgba(212, 74, 36,0.9)",
				  "rgba(176, 45, 9,1)",
				  "rgba(140, 30, 0,1)"],
		  startPoints:[0,0.05,0.3,0.6,0.8]
		}}
	  />
	  {homes.map((e) => home_marker(e))
	  }
	</View>
	)
  }


export function old_home(rides, stations){
	let home_list = [];
	let day_list = [];
	let date = new Date(rides[0].date);
	let time = (date.getTime()/1000-6*3600);
	let start_day = (time-time%(24*3600)+2*3600);
	let station_deb = rides[0].stationStart;
	for (let i = 0;i < rides.length; i++){
		if (rides[i].stationStart == "0"){
			break;
		}
		if (rides[i].stationStart == rides[i].stationEnd){
			continue;
		}
		
		let date = new Date(rides[i].date);
		let date_i =  date.getTime()/1000;
		if (date_i < start_day){
			home_list.push(station_deb);
			day_list.push(i-1);
			let time = (date.getTime()/1000-6*3600);
			start_day = (time-time%(24*3600)+2*3600);
			home_list.push(rides[i].stationEnd);
			day_list.push(i);
			
		}

		station_deb = rides[i].stationStart;

	
	}

	let maisons = [];
	let rides_maisons_start = [];
	let rides_maisons_end = [];
	let last_maison = undefined;
	let dico_maison = {};
	let n =home_list.length;
	for (let i = 1; i <= n; i++){
			let station_i = home_list[n-i];
			if (dico_maison[station_i] == undefined){
				dico_maison[station_i] =0;
			}
			dico_maison[station_i] += 1;
			if (i >= 11){
				let station_j = home_list[n-(i-10)];
				dico_maison[station_j]-= 1;
			
			for (var station in dico_maison) {
				var n_tot = dico_maison[station];
				if (n_tot  >= 7){
					if (station == last_maison){
						rides_maisons_end[maisons.length-1] = day_list[n-i];
					}else{
						last_maison = station;
						rides_maisons_start.push(day_list[n-(i-10)]);
						rides_maisons_end.push(day_list[n-(i)]);
						maisons.push(station);
					}
				}
			}
			}
	}

	let maisons_json = [];
	let maisons_seen = [];
	for (let i = maisons.length-1; i >=0; i--){
		let x = {};
		if (maisons[i] in maisons_seen){
			x["seen"] = true;
		}else{

			x["seen"] = false;
			maisons_seen.push(maisons[i]);
		}
		x["station"] = stations[maisons[i]][0];
		x["lat"] = stations[maisons[i]][1];
		x["lon"] = stations[maisons[i]][2];
		x["current"] = false;
		if (i == maisons.length-1){
			x["current"] = true;
		}

		let date_start = new Date(rides[rides_maisons_start[i]].date);
		let month = date_start.getMonth()+1;
		if (month < 10){
			month = "0"+month;
		}
		x["start"] =  (date_start.getDate()+"/"+(month)+"/"+date_start.getFullYear());
		let date_end = new Date(rides[rides_maisons_end[i]].date);
		let month_end = date_end.getMonth()+1;
		if (month_end < 10){
			month_end = "0"+month_end;
		}
		x["end"] =  (date_end.getDate()+"/"+(month_end)+"/"+date_end.getFullYear());
		maisons_json.push(x);
	}

	return maisons_json;

}


function convertRad(input){
	return (Math.PI * input)/180;
}

function distance(lat_a_degre, lon_a_degre, lat_b_degre, lon_b_degre){
 
	let R = 6378000 //Rayon de la terre en mètre

	let lat_a = convertRad(lat_a_degre);
	let lon_a = convertRad(lon_a_degre);
	let lat_b = convertRad(lat_b_degre);
	let lon_b = convertRad(lon_b_degre);
	
	let d = R * (Math.PI/2 - Math.asin( Math.sin(lat_b) * Math.sin(lat_a) + Math.cos(lon_b - lon_a) * Math.cos(lat_b) * Math.cos(lat_a)))
	return d;
}

export function closest_station(position, stations){
	let mindist;
	let argmin;
	let dist = 0;
	let stations_list = Object.entries(stations);
	for (let i = 0;i < stations_list.length; i++) {
		let id = stations_list[i][0];
		let station = stations[id];
		let latitude =  station[1]
		let longitude = station[2]
		dist = distance(position.latitude, position.longitude, latitude, longitude);
		if (mindist == undefined || dist < mindist){
			mindist = dist;
			argmin = id;
		}
	}
	return stations[argmin];




}