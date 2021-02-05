export function plusLongVoyage(rides) {
	var longestTrip = 0;
	var lastTime = 0;
	var totalDist = 0;
	for (let i = 0; i < rides.length; i++) {

		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			var dist = r.dist / 1000;
			var newTime = Date.parse(r.date);
			if (newTime - lastTime <= (600 * 1000)) {
				totalDist += dist;
			} else {
				if (totalDist > longestTrip) {
					longestTrip = totalDist;
				}
				totalDist = dist;
			}
			lastTime = newTime + r.duration * 1000;

		}
	}

	if (totalDist > longestTrip) {
		longestTrip = totalDist;
	}

	return longestTrip

}


export function getStats(rides) {
	//Init count
	var totalDist = 0;
	var totalDistElec = 0;
	var totalDistMeca = 0;
	var totalTime = 0;
	var totalDistMonth = 0;

	//Init dates
	var today = new Date(Date.now());
	var thisMonth = today.getMonth();
	var thisYear = today.getFullYear();


	var longestTrip = plusLongVoyage(rides);

	for (let i = 0; i < rides.length; i++) {

		// Get ride and check that > 100m
		let r = rides[i];
		if (r.dist > 100) {

			// Increment dist
			totalDist += r.dist / 1000;
			if (r.elec) {
				totalDistElec += r.dist / 1000;
			} else {
				totalDistMeca += r.dist / 1000;
			}

			let date = new Date(r.date);
			var newYear = date.getFullYear();
			var newMonth = date.getMonth();
			if ((newYear == thisYear) && (newMonth == thisMonth)) {
				totalDistMonth += r.dist / 1000;
			}

			// Increment Time
			totalTime += r.duration;


		}

	}

	return {
		"total": totalDist,
		"totalElec": totalDistElec,
		"totalMeca": totalDistMeca,
		"totalMonth": totalDistMonth,
		"totalTime": totalTime,
		"longest": longestTrip
	}



}


export function getStatsItems(userInfos) {
	let out = [];
	out.push({
		id: 0,
		text: "Distance totale",
		value: Math.round(1000 * userInfos.infosDists.total) / 1000 + " km"
	});
	out.push({
		id: 1,
		text: "Distance en éléctrique",
		value: Math.round(1000 * userInfos.infosDists.totalElec) / 1000 + " km"
	});
	out.push({
		id: 2,
		text: "Distance en mécanique",
		value: Math.round(1000 * userInfos.infosDists.totalMeca) / 1000 + " km"
	})
	out.push({
		id: 3,
		text: "Distance ce mois",
		value: Math.round(1000 * userInfos.infosDists.totalMonth) / 1000 + " km"
	})
	out.push({
		id: 4,
		text: "CO2 économisé",
		value: Math.round(userInfos.infosDists.total * 111) / 1000 + " kg"
	})
	out.push({
		id: 5,
		text: "Temps total",
		value: Math.floor(userInfos.infosDists.totalTime / 3600) + " h " + Math.floor((userInfos.infosDists.totalTime % 3600) / 60) + " m "
	})
	out.push({
		id: 6,
		text: "Plus long voyage",
		value: Math.round(1000 * userInfos.infosDists.longest) / 1000 + " km"
	})
	out.push({
		id: 7,
		text: "Argent dépensé",
		value: Math.round(100 * userInfos.totalMoney) / 100 + " €"
	})
	out.push({
		id: 8,
		text: "Prix au km",
		value: Math.round(100 * userInfos.totalMoney / userInfos.infosDists.total) / 100 + " €/km"
	})

	return out

}