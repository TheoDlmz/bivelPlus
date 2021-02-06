
import { getStats } from '../utils/stats'
import { distribDistHour } from '../utils/graphFunctions'
import { getFavoriteStations, getFavoriteRoutes } from '../utils/mapFunctions'

// Nombre de trajets au coucher du soleil
export function dawn(rides) {

	const horaires = require('../json/sunout.json');
	let count = 0;
	let oneDay = 1000 * 60 * 60 * 24;

	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if (r.dist > 100) {
			var deb = new Date(r.date);
			var fin = new Date(Date.parse(deb) + (r.duration) * 1000);
			var start = new Date(deb.getFullYear(), 0, 0)
			var diff = deb - start;
			var day = Math.floor(diff / oneDay);
			var hourDeb = deb.getHours();
			var minDeb = deb.getMinutes();
			var hourEnd = fin.getHours();
			var minEnd = fin.getMinutes();
			var hourDawn = horaires['horaires'][day]['heureCouche'];
			var minDawn = horaires['horaires'][day]['minuteCouche'];
			if (((hourDawn > hourDeb) ||
				((hourDawn == hourDeb) && (minDawn >= minDeb))) && ((hourDawn < hourEnd) ||
					((hourDawn == hourEnd) && (minDawn < minEnd)))) {
				count += 1;
			}
		}


	}
	return count

}


// Déjà fait un trajet au bday
export function veloBday(rides, bday_string) {
	let bday = new Date(bday_string);
	let out = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if (r.dist > 100) {
			var newTime = new Date(r.date);
			if ((newTime.getDate() == bday.getDate()) && (newTime.getMonth() == bday.getMonth())) {
				out += 1;
			}

		}
	}
	return out
}


// Meca -> Elec
export function changementStrat(rides) {

	let count = 0;
	let lastTime = 0;
	let firstStep = false;
	let secondStep = false;

	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 1000) {
			var date = new Date(r.date);
			var newTime = Date.parse(date);
			if ((newTime - lastTime <= (600 * 1000))) {
				if (r.elec && (firstStep) && (!secondStep)) {
					secondStep = true;
					count += 1;
				}
			} else {
				if (!r.elec) {
					firstStep = true;
				} else {
					firstStep = false;
				}
				secondStep = false;
			}
			lastTime = newTime + r.duration * 1000;
		}
	}
	return count;
}


// Jours consécutifs
export function maxConsecDays(rides) {

	let maxDays = 0;
	let currentDay = 0;
	let nbDays = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			let date = new Date(r.date);
			var newDay = Math.floor(Date.parse(date) / (3600 * 24 * 1000));
			if (newDay == currentDay + 1) {
				nbDays += 1
			} else if (newDay != currentDay) {
				if (maxDays < nbDays) {
					maxDays = nbDays;
				}
				nbDays = 1;
			}
			currentDay = newDay;
		}
	}
	if (nbDays > maxDays) {
		maxDays = nbDays;
	}
	return maxDays;
}

// Count Id
export function countId(rides) {

	let idSeen = new Map();
	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if ((r.dist > 100) && (r.bikeId != "")) {
			let date = new Date(r.date);
			let newDay = Math.floor(Date.parse(date) / (3600 * 24 * 1000));
			if (idSeen.has(r.bikeId)) {
				let tab = idSeen.get(r.bikeId);
				if (!(tab.includes(newDay))) {
					tab.push(newDay);
					idSeen.set(r.bikeId, tab);
				}
			} else {
				idSeen.set(r.bikeId, [newDay]);
			}
		}
	}

	let iterator = idSeen.values();
	let cont = true;
	let maxTime = 0;
	let countVelos = 0;

	while (cont) {
		let newE = iterator.next().value
		if (newE == undefined) {
			cont = false;
		} else {
			countVelos += 1;
			let maxDay = Math.max(...newE);
			let minDay = Math.min(...newE);
			if ((maxDay - minDay) > maxTime) {
				maxTime = maxDay - minDay;
			}
		}

	}
	return [countVelos, maxTime]

}


export function distDimanche(rides) {
	let totalDist = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if (r.dist > 100) {
			let date = new Date(r.date);
			if ((date.getHours() >= 6) && (date.getHours() < 12) && (date.getDay() == 0)) {
				totalDist += r.dist / 1000
			}
		}
	}
	return totalDist;
}


export function oubli(rides) {
	let count = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if (r.dist > 100) {
			if ((r.duration >= 60 * 60 * 2) && (r.dist / r.duration <= 0.5)) {
				count += 1;
			}
		}
	}
	return count;
}


export function newYear(rides) {
	let count = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			let date = new Date(r.date);
			let y_deb = date.getYear();
			let date_end = new Date(Date.parse(date) + r.duration * 1000);
			let y_end = date_end.getYear();
			if (y_deb != y_end) {
				count += 1;
			}
		}
	}
	return count;
}


export function minuit(rides) {
	let count = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			let date = new Date(r.date);
			if (Math.round(Date.parse(date) / (3600 * 1000 * 24)) != Math.round((Date.parse(date) + r.duration * 1000) / (3600 * 1000 * 24))) {
				count += 1;
			}
		}
	}
	return count;
}


export function maxDistVoyages(rides) {
	let maxDist = 0;
	let lastTime = 0;
	let totalDist = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			let dist = r.dist / 1000;
			let date = new Date(r.date);
			let newTime = Date.parse(date);
			if ((newTime - lastTime <= (600 * 1000)) || (i == 0)) {
				totalDist += dist;
			} else {
				if (totalDist > maxDist) {
					maxDist = totalDist;
				}
				totalDist = dist;
			}
			lastTime = newTime + r.duration * 1000;
		}
	}
	if (totalDist > maxDist) {
		maxDist = totalDist;
	}
	return maxDist;
}


export function maxDistOneDay(rides) {
	let maxDist = 0;
	let lastDay = 0;
	let totalDist = 0;
	for (let i = 0; i < rides.length; i++) {
		let r = rides[rides.length - 1 - i];
		if (r.dist > 100) {
			let dist = r.dist / 1000;
			let date = new Date(r.date);
			let newDay = Math.floor(Date.parse(date) / (3600 * 24 * 1000));
			if ((newDay == lastDay) || (i == 0)) {
				totalDist += dist;
			} else {
				if (totalDist > maxDist) {
					maxDist = totalDist;
				}
				totalDist = dist;
			}
			lastDay = newDay;
		}
	}
	if (totalDist > maxDist) {
		maxDist = totalDist;
		totalDist = 0;
	}
	return maxDist;
}


export function priceBefore(rides) {
	let results = [0, 0];
	for (let i = 0; i < rides.length; i++) {
		let r = rides[i];
		if (r.dist > 100) {
			if (((r.duration >= 60 * 30 + 30) && (r.duration <= 60 * 31) && r.cost == 0) ||
				((r.duration >= 60 * 60 + 30) && (r.duration <= 60 * 61) && r.cost == 0)) {
				results[0] += 1;
			}
			if (((r.duration > 60 * 31) && (r.duration <= 60 * 32) && r.cost > 0) ||
				((r.duration > 60 * 61) && (r.duration <= 60 * 62) && r.cost > 0)) {
				results[1] += 1;
			}
		}
	}
	return results
}


export function compute_mesures(rides, bday) {
	let dict_mesures = {};

	let mainStats = getStats(rides);
	dict_mesures['total'] = mainStats['total'];
	dict_mesures['elec'] = mainStats['totalElec'];
	dict_mesures['meca'] = mainStats['totalMeca'];
	let hours = distribDistHour(rides);
	let hours_elec = hours[1];
	let hours_meca = hours[2];
	let nuit = 0;
	for (let i = 2; i < 6; i++) {
		nuit += hours_elec[i];
		nuit += hours_meca[i];
	}

	let matin = 0;
	for (let i = 6; i <= 8; i++) {
		matin += hours_elec[i];
		matin += hours_meca[i];
	}

	dict_mesures['nuit'] = nuit;
	dict_mesures['matin'] = matin;
	let compteId = countId(rides);
	dict_mesures['id'] = compteId[0];
	dict_mesures['maxDaysInterval'] = compteId[1];

	var firstRide = Date.parse(rides[rides.length - 1].date) / (3600 * 24 * 1000);
	var today = Date.now() / (3600 * 24 * 1000);
	let quotient = Math.floor((today - firstRide) / 365);
	dict_mesures['old'] = quotient;
	dict_mesures['dimanche'] = distDimanche(rides);
	dict_mesures['stations'] = getFavoriteStations(rides).total.length;
	dict_mesures['fidelity'] = maxConsecDays(rides);
	let islucky = priceBefore(rides);
	dict_mesures['chance'] = islucky[0];
	dict_mesures['malchance'] = islucky[1];
	dict_mesures['idiot'] = oubli(rides);
	dict_mesures['stratege'] = changementStrat(rides);
	dict_mesures['minuit'] = minuit(rides);
	dict_mesures['anniv'] = veloBday(rides, bday);
	dict_mesures['newyear'] = newYear(rides);
	dict_mesures['carbone'] = mainStats['total'] * 0.111;
	dict_mesures['soleil'] = dawn(rides);
	dict_mesures['totalDay'] = maxDistOneDay(rides);
	dict_mesures['totalTrip'] = maxDistVoyages(rides);
	dict_mesures['trajet'] = getFavoriteRoutes(rides)[0][0];


	console.log(dict_mesures);
	return dict_mesures;

}


export function compute_voyages(mesures, json_voyages) {
	let n = json_voyages.length;
	let dist_totale = mesures.total;
	let i = 0;
	while ((i < n) && (json_voyages[i].Dist <= dist_totale)) {
		i += 1;
	}
	return i;

}


export function compute_badges(mesures, json_badges) {
	let n = json_badges.length;
	let obtained = [];
	let notobtained = [];
	for (let i = 0; i < n; i++) {
		let mesure = json_badges[i]['Mesure'];
		let value = mesures[mesure];
		let levels = json_badges[i]['Descriptions'];
		let success = -1;
		let seuil = levels[0].Seuil;
		for (let j = 0; j < levels.length; j++) {
			if (levels[j].Seuil <= value) {
				success = j;
				if (j < levels.length-1){
					seuil = levels[j+1].Seuil
				}
			}
		}


		if (success >= 0) {
			obtained.push({ 
				"id": i, 
				"level": 3 + success - levels.length, 
				"seuil":seuil,
				"value":value });
		} else {
			notobtained.push(i);
		}
	}
	return { "obtained": obtained, "not_obtained": notobtained };
}


export function compute_events(rides, json_events) {

	let events = [];
	for (let j = 0; j < json_events.length; j++) {
		var ev = json_events[j];
		let debut = new Date(ev.Start);
		let fin = new Date(ev.End);
		events.push({ "debut": debut, "fin": fin, "total": 0, "seuil": ev.Total })
	}
	for (let i = 0; i < rides.length; i++) {
		var r = rides[i];
		if (r.dist > 100) {
			var rDate = Date.parse(r.date);
			for (let j = 0; j < json_events.length; j++) {
				if ((events[j].debut <= rDate) && (events[j].fin >= rDate)) {
					events[j].total += r.dist / 1000;
				}
			}

		}
	}
	let list_event = [];
	for (let j = 0; j < json_events.length; j++) {

		if (events[j].total >= events[j].seuil) {
			list_event.push(j)
		}
	}
	return list_event;

}