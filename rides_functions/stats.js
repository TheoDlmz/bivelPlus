export function plusLongVoyage(rides){
	var longestTrip = 0;
	var lastTime = 0;
	var totalDist = 0;
	for (let i=0;i< rides.length;i++){
		
		let r = rides[rides.length-1-i];
		if (r.dist > 100){
			var dist = r.dist/1000;
			var newTime = Date.parse(r.date);
			if (newTime-lastTime <= (600*1000)){
				totalDist += dist;
			}else{
				if (totalDist > longestTrip){
					longestTrip = totalDist;
				}
				 totalDist = dist;
			}
			lastTime = newTime+r.duration*1000;
			
		 }
		}
		
		if (totalDist > longestTrip){
					longestTrip = totalDist;
				}	

	return longestTrip

}


export function getStats(rides){
	//Init count
	var totalDist = 0;
	var totalDistElec = 0;
	var totalDistMeca = 0;
	var totalTime = 0;
	var	totalDistMonth = 0;

	//Init dates
	var today = new Date(Date.now());
	var thisMonth = today.getMonth();
	var thisYear = today.getFullYear();


	var longestTrip = plusLongVoyage(rides);
	
	for (let i=0; i < rides.length; i++){

		// Get ride and check that > 100m
		let r = rides[i];
		if (r.dist > 100){
			
			// Increment dist
			totalDist += r.dist/1000;
			if (r.elec){
				totalDistElec += r.dist/1000;
			}else{
				totalDistMeca += r.dist/1000;
			}

			let date = new Date(r.date);
			var newYear = date.getFullYear();
			var newMonth = date.getMonth();
			if ((newYear == thisYear) && (newMonth == thisMonth)){
				totalDistMonth += r.dist/1000;
			}

			// Increment Time
			totalTime += r.duration;
			
			
		}
		
	}
	
	return {
		"total":totalDist,
		"totalElec":totalDistElec,
		"totalMeca":totalDistMeca,
		"totalMonth":totalDistMonth,
		"totalTime":totalTime,
		"longest":longestTrip}
	
	
	
}
