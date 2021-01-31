export function getRides(json_file){

    var data = json_file['walletOperations'];
	var rides = [];
    for (let i = 0; i < data.length; i++){
        var distance = data[i]['parameter3']['DISTANCE'];
        var isElec = (data[i]['parameter1'] == "yes");
        var when = new Date(data[i]['operationDate']);
		if (data[i]['startDate'] == undefined){
        var duration = data[i]["quantity"];
		}else{
		
		var duration = (data[i]['endDate']-data[i]['startDate'])/1000;
			
		}
        var bikeId = data[i]['parameter3']['BIKEID'];
		var price = data[i]['amountWithTax'];
		
		var stationStart = 0;
		var stationEnd = 0;
		if (data[i]['parameter3']['departureStationId'] != undefined){
			stationStart = data[i]['parameter3']['departureStationId'];
			stationEnd = data[i]['parameter3']['arrivalStationId'];
			
		}
        rides.push(
			{"dist":parseFloat(distance),
			"elec":isElec,
			"date":when,
			"duration":duration,
			"bikeId":bikeId,
			"cost":price,
			"stationStart":stationStart,
			"stationEnd":stationEnd,
			"idRide":i});
	}
    return rides

}

export function dicoStations(station_json){
	var dico = {};
	let data = station_json['data']['stations'];
    for (let i = 0; i < data.length; i++){
		dico[data[i]['station_id']] = [data[i]['name'],data[i]['lat'],data[i]['lon']];	
	}
	return dico
	
}


export function getPayments(json_file){
	var totalDepenses = 0;
	data = json_file['customerPaymentDtoList'];
	for (let i = 0; i < data.length; i++){
		totalDepenses += data[i]['amount'];
		
	}
	return totalDepenses
}

