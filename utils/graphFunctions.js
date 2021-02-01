function monthBefore(year,month){
	if (month == 0){
		return [year-1,11]
	}else{
		return [year,month-1]
	}
	
	
	
}
function monthAfter(year,month){
	if (month == 11){
		return [year+1,0]
	}else{
		return [year,month+1]
	}
	
	
	
}


function dateToStr(year,month){
	return (month+1).toString()+"/"+year.toString()	
  }

  
export function evolDist(rides){
	var tabCumulDistElec = [0,0];
	var tabCumulDistMeca = [0,0];
	var tabEvolDist = [0];
	var tabEvolDistElec = [0];
	var tabEvolDistMeca = [0];
	let currDate = new Date(rides[rides.length-1].date);
	var currentMonth = currDate.getMonth();
	var currentYear = currDate.getFullYear();
	var momentStart = monthBefore(currentYear,currentMonth);
	var labels = [dateToStr(momentStart[0],momentStart[1]),dateToStr(currentYear,currentMonth)];
	for (let i =0; i < rides.length; i++){
		let r = rides[rides.length-1-i]
		if (r.dist > 100){
			let date = new Date(r.date);
			var newMonth = date.getMonth();
			var newYear = date.getFullYear();
			var dist = r.dist/1000;
			while ((newMonth != currentMonth) || (newYear != currentYear)){
				tabCumulDistElec.push(tabCumulDistElec[tabCumulDistElec.length-1]);
				tabCumulDistMeca.push(tabCumulDistMeca[tabCumulDistMeca.length-1]);
				tabEvolDist.push(0);
				tabEvolDistElec.push(0);
				tabEvolDistMeca.push(0);
				var newMoment = monthAfter(currentYear,currentMonth);
				currentYear = newMoment[0];
				currentMonth = newMoment[1];
				labels.push(dateToStr(currentYear,currentMonth));
			}
			tabEvolDist[tabEvolDist.length-1] += dist;
			if (r.elec){
				tabCumulDistElec[tabCumulDistElec.length-1] += dist;
				tabEvolDistElec[tabEvolDist.length-1] += dist;
			}else{
				
				tabCumulDistMeca[tabCumulDistMeca.length-1] += dist;
				tabEvolDistMeca[tabEvolDist.length-1] += dist;
				
			}
		
		}
		
	}
	return [tabCumulDistElec,tabCumulDistMeca,tabEvolDist,tabEvolDistElec,tabEvolDistMeca,labels]
	
	
	
}


export function distribDistHour(rides){
	var tabDistribHourElec = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var tabDistribHourMeca = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var labels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	for (let i =0; i < rides.length; i++){
		let r = rides[i];
		if (r.dist > 100){
			let date = new Date(r.date);
			var h = date.getHours();
			if (r.elec){
			tabDistribHourElec[h] += r.dist/1000;
			}else{
			tabDistribHourMeca[h] += r.dist/1000;
			}
		}
	
	}
	return [labels,tabDistribHourElec,tabDistribHourMeca]
}
	


export function distribSpeed(rides){
	var tabDistribSpeedElec =[];
	var tabDistribSpeedMeca =[];
	var labels = [];
	let countElec = 0;
	let countMeca = 0;
	for (let i =0; i < rides.length; i++){
		let r = rides[i]
		if (r.dist > 100){
			var speed = Math.floor(r.dist*1.8/r.duration);
			if (r.elec){
				countElec += 1;
				 if (tabDistribSpeedElec[speed] == undefined){
					 tabDistribSpeedElec[speed] = 1;
				 }else{
					 tabDistribSpeedElec[speed] += 1;					
				 }
			}else{
				countMeca += 1;
				 if (tabDistribSpeedMeca[speed] == undefined){
				 tabDistribSpeedMeca[speed] = 1;
				 }else{
					 tabDistribSpeedMeca[speed] += 1;					
			 }
			}
			
			
			
		}
		
	}
		
	for (let i=0;i < tabDistribSpeedElec.length;i++){
		if (tabDistribSpeedElec[i] == undefined){
					tabDistribSpeedElec[i] = 0;
		}else{
			tabDistribSpeedElec[i] /= countElec;
		}
		labels[i] = 2*i;
		if (i >= tabDistribSpeedMeca.length){
					tabDistribSpeedMeca[i] = 0;
			
		}
	}
	for (let i=0;i < tabDistribSpeedMeca.length;i++){
		if (tabDistribSpeedMeca[i] == undefined){
					tabDistribSpeedMeca[i] = 0;
		}else{
			tabDistribSpeedMeca[i] /= countMeca;
		}	
		labels[i] = 2*i;
		if (i >= tabDistribSpeedElec.length){
					tabDistribSpeedElec[i] = 0;
			
		}
	}
	tabDistribSpeedElec.push(0)
	tabDistribSpeedMeca.push(0)
	labels.push(labels[labels.length-1]+2);
	
	return [tabDistribSpeedElec,tabDistribSpeedMeca,labels]
}


export function distribDistDay(rides){
	var tabDistribHourElec = [0,0,0,0,0,0,0];
	var tabDistribHourMeca = [0,0,0,0,0,0,0];
	var labels = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
	for (let i =0; i < rides.length; i++){
		let r = rides[i];
		if (r.dist > 100){
			let date = new Date(r.date);
			var d = date.getDay();
			if (d == 0){
				d = 7;
			}
			if (r.elec){
			tabDistribHourElec[d-1] += r.dist/1000;
			}else{
			tabDistribHourMeca[d-1] += r.dist/1000;
			}
		}
	
	}
	return [labels,tabDistribHourElec,tabDistribHourMeca]
}


export function jourNuit(rides){
    const horaires = require('../json/sunout.json');
	var jourCount = 0;
	var nuitCount = 0;
	for (let i =0; i < rides.length; i++){
		let r = rides[i];
		if (r.dist > 100){
			var deb = new Date(r.date);
			var start = new Date(deb.getFullYear(), 0, 0)
			var diff = deb - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var day = Math.floor(diff / oneDay);
			var hourDeb = deb.getHours();
			var minDeb = deb.getMinutes();
			var hourDawn = horaires['horaires'][day]['heureCouche'];
			var minDawn = horaires['horaires'][day]['minuteCouche'];
			var hourDusk = horaires['horaires'][day]['heureLeve'];
			var minDusk = horaires['horaires'][day]['minuteLeve'];
			if (((hourDawn < hourDeb) || ((hourDawn == hourDeb) && (minDawn <= minDeb))) || (hourDusk > hourDeb) || ((hourDusk == hourDeb) && (minDusk < minDeb))){
				nuitCount += r.dist/1000;
			}else{
				jourCount += r.dist/1000;				
			}
		}
	
	}
	
	return [jourCount,nuitCount]
	
	
	
	
	
}



export function distribDistOneDay(rides){
	var tabDistribDist =[];
	var labels = [];
	var lastDay = 0;
	var totalDist = 0;
	for (let i=0;i< rides.length;i++){
		
		let r = rides[rides.length-1-i];
		if (r.dist > 100){
			var dist = r.dist/1000;
			var newDay = Math.floor(Date.parse(r.date)/(3600*24*1000));
			if ((newDay == lastDay) || (i == 0)){
				totalDist += dist;
			}else{
				let finalDist = Math.floor(totalDist/2);
				if (tabDistribDist[finalDist] == undefined){
					 tabDistribDist[finalDist] = 1;
				 }else{
					 tabDistribDist[finalDist] += 1;					
				 }
				 totalDist = dist;
			}
			lastDay = newDay;
			
		 }
		}
		let finalDist = Math.floor(totalDist/2);
		if (tabDistribDist[finalDist] == undefined){
			 tabDistribDist[finalDist] = 1;
		 }else{
		 tabDistribDist[finalDist] += 1;					
		 }
			
		
	for (let i=0;i < tabDistribDist.length;i++){
		if (tabDistribDist[i] == undefined){
					tabDistribDist[i] = 0;
		}
		labels[i] = i*2;
	}
	
	tabDistribDist.push(0)
	labels.push(labels[labels.length-1]+2);
	return [tabDistribDist,labels]

}


export function distribDist(rides){
	var tabDistribDistElec =[];
	var tabDistribDistMeca =[];
	var labels = [];
	for (let i=0;i< rides.length;i++){
		
		let r = rides[i];
		if (r.dist > 100){
			 var dist = Math.floor(r.dist/1000);
			 if (r.elec){
				 if (tabDistribDistElec[dist] == undefined){
					 tabDistribDistElec[dist] = 1;
				 }else{
					 tabDistribDistElec[dist] += 1;					
				 }
			}else{
				 if (tabDistribDistMeca[dist] == undefined){
				 tabDistribDistMeca[dist] = 1;
				 }else{
					 tabDistribDistMeca[dist] += 1;					
			 }
		 }
		}
	}
			
			
		
	for (let i=0;i < tabDistribDistElec.length;i++){
		if (tabDistribDistElec[i] == undefined){
					tabDistribDistElec[i] = 0;
		}
		labels[i] = i;
		if (i >= tabDistribDistMeca.length){
					tabDistribDistMeca[i] = 0;
			
		}
	}
	for (let i=0;i < tabDistribDistMeca.length;i++){
		if (tabDistribDistMeca[i] == undefined){
					tabDistribDistMeca[i] = 0;
		}		
		labels[i] = i;
		if (i >= tabDistribDistElec.length){
					tabDistribDistElec[i] = 0;
			
		}
	}
	
	tabDistribDistElec.push(0)
	tabDistribDistMeca.push(0)
	labels.push(labels[labels.length-1]+1);
		
		
	
	return [tabDistribDistElec,tabDistribDistMeca,labels]
	
	

}
