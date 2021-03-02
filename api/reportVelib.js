import {success, failure} from '../utils/premises'
import {bivelAPI, velibAPI, header} from './api_adresses'
import {getItemValue, setItemValue} from '../utils/storage'
import {getCurrentDate} from '../utils/miscellaneous'

export const fileReport = async (bikeId, user, error, bivelId, closest) => {
        if ((bikeId == "1234")||(bikeId == "0000")){
            return success();
        }

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
        let meta_error = "c_velo_endommage";
        if (error.error == "Vélib' volé"){
            meta_error = "c_velo_abandonne"
        }
        let data = {
            "origin":	"Web",
            "orgid":	"00D0Y0000035SQ3",
            "debug":	"0",
            "debugEmail":	"",
            "retURL":	"",
            "recordType":	"0120Y000000Kezr",
            "00N0Y00000RKgb8":'1',
            "00N0Y00000RKgb7":	user.firstname,
            "name":	user.lastname,
            "email":user.email,
            "type":	meta_error,
            "00N0Y00000RKgb3":user.id,
            "00N0Y00000RKgb2":	bikeId,
            "00N0Y00000RKgb5":	error.sc,
            "Numero_de_bornette__c":	"",
            "00N0Y00000RKgat":	error.ssc,
            "Adresse__c":	station,
            "description":	message + "\n Envoyé depuis Bivel.",
            "submit":	"",
        };
        

        let data_Bivel ={
            "bikeId":bikeId,
            "bivelId":bivel_id,
            "error":error.error,
            "message":error.message,
            "station":station
        };

        let data_local = {
            "velib_id":bikeId,
            "error":error.error,
            "date":getCurrentDate(),
            "station":station};

       
        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        try{

            let url =velibAPI.report;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: formBody
            });


            if (response.ok){
                
                const responseUpdate = await fetch(bivelAPI.report, {
                    method: 'POST',
                    headers: new Headers(header),
                    body: JSON.stringify(data_Bivel)
                });
                let reports = await getItemValue("@reports");
                if (reports == undefined){
                    reports = [];
                }else{
                    reports = JSON.parse(reports);
                }
                reports.push(data_local);
                setItemValue("@reports",JSON.stringify(reports));
                
                return success();
            }else{
                return failure();
            }
        }catch(e){
            return failure();
          }
}