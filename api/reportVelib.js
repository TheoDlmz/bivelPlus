import {success, failure} from '../utils/premises'

export const fileReport = async (bikeId, user, error, bivelId, closest) => {
        let bivel_id;
        if (bivelId == undefined){
            bivel_id = "-1";
        }else{
            bivel_id = bivelId;
        }
        let message = error.message;
        let station = "";
        if (closest){
            message += "\n A proximité de la station "+closest;    
            station = closest;
        }
        let data = {
            "00N0Y00000RKgb2":bikeId,
            "00N0Y00000RKgb3":user.id,
            "retURL":"",
            "recordType":"0120Y000000Kezr",
            "description":"",
            "type":"Incident",
            "00N0Y00000RKgb3":"Vélo endommagé",
            "00N0Y00000RKgat":error.error,
            "orgid":"00D0Y0000035SQ3",
            "00N0Y00000RKgb7":user.firstname,
            "00N0Y00000RKgb8":message + "\n Envoyé depuis BVP.",
            "debugEmail":"",
            "name":user.lastname,
            "email":user.email
        };

        let data_Bivel ={
            "bikeId":bikeId,
            "bivelId":bivel_id,
            "error":error.error,
            "message":error.message,
            "station":station
        }
        
        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        try{

            let url ="https://eu26.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: formBody
            });


            if (response.ok){
                
                const responseUpdate = await fetch('https://theo.delemazure.fr/bivelAPI/report.php', {
                    method: 'POST',
                    headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept':'Application/json'
                    }),
                    body: JSON.stringify(data_Bivel)
                });
                return success();
            }else{
                return failure();
            }
        }catch(e){
            console.log(e);
            return failure();
          }
}