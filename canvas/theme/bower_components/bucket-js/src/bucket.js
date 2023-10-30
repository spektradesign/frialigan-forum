/* Bucket JS - Localstorage library
 * Author: Tushar Singh
 * License: MIT
 */

;(function(){

//OBJECT CONSTRUCTOR
//------------------
var _bucket = function(name){
    this.bucketName = (!name) ? '' : name;
};

window.bucket = function(name){ return new _bucket(name) };

//CONFIGURATION
bucket.config = {
    suffix          : 'Bucket',
    getterMode      : 1 //0: convert to proper data-type | 1: Return in the same data-type as it was stored
};

//CONFIG CHANGER FUNCTION
bucket.setting = function(arg1, arg2){
    //multiple settings
    if (typeof arg1 == 'object') {
        for(var setting in arg1){
            if (bucket.config[setting]) {
                bucket.config[setting] = arg1[setting]
            }
        }
    }
    //single setting
    else if (arg1 !== undefined && arg2 !== undefined) {
        if (bucket.config[arg1] !== undefined) {
            bucket.config[arg1] = arg2
        }
    }
}

//INTERNAL FUNCTIONS
var fn = {
    
    //bucket instance checker
    isBucket: function(key,name){
        var index = (name == undefined) ? key.indexOf('["'+bucket.config.suffix+'",') : key.indexOf('["'+bucket.config.suffix+'","'+name);
        
        if ( index == 0) {
            return true
        }
        else {
            return false
        }
    },
    
    parse: function(string){
        try {
            //parse if JSON
            return JSON.parse(string)
        
        } catch(e) { //if not JSON
            
            if (string!=null && string!=undefined) {
                
                //boolean
                if (string=="true")                         { return true }
                else if (string=="false")                   { return false }
                
                //Number
                else if (/^[0-9]+.[0-9]+$/.test(string))    { return Number(string) }
                
                //null or undefined
                else if (string=="null")                    { return null }
                else if (string=="undefined")               { return undefined }
            }
            
            return string;
            
        }
    }
    
}


// BUCKET OBJECT METHODS
// ---------------------
_bucket.prototype = {
    
    //SETTER
    set: function(key,value,params){
        
        if (value !== undefined) {
            
            var keyArray, dataType, event;
            
            $value           = (typeof value == "object") ? [JSON.stringify(value)]: [value]; //Stringify Objects. Store other data-type as-is
            keyArray        = [bucket.config.suffix, this.bucketName, key];
            dataType        = typeof(value); //store value's data-type to return properly on .get()
            
            //event object (passed as argument to event functions)
            event = {
                bucket      : this.bucketName,
                value       : value,
                key         : key,
                dataType    : dataType
            };
            
            //push datatype to value array
            $value.push(dataType);
            
            if (params) {
                
                //item age
                if (params.age) {
                    var expiryDate          = new Date();                               //current time
                        expiryDate.setSeconds(expiryDate.getSeconds() + params.age);    //add age to current time and we have expiryDate
                    
                    //push datatype to value array
                    $value.push(JSON.stringify(expiryDate));
                    
                    //expKeys - a localstorage key for bucket to identify if there are keys with expiryDate
                    //this way .removeExpired() doesn't run unneccesarily
                    var expKeys = (localStorage['Bucket--ExpKeys'] == undefined) ? 0 : Number(localStorage['Bucket--ExpKeys']);
                    localStorage['Bucket--ExpKeys'] = expKeys + 1;
                    
                    //add properties in event object
                    event.age               = params.age;
                    event.expiryDate        = expiryDate;
                }
            }
            
            
            //Store
            localStorage[JSON.stringify(keyArray)] = JSON.stringify($value);
            
            //run event functions
            for(var x=0, l=bucket.events.set.length; x<l; x++){
                bucket.events.set[x](event);//event object as argument
            }
            
            return value;
        }
        else {
            return false
        }
    },
    
    //GETTER
    get: function(key){
        
        //return key value if key is passed
        if (key) {
            var
            storageKey  = JSON.stringify([bucket.config.suffix, this.bucketName, key]),
            keyValue    = localStorage[storageKey],
            
            keyArray, value, params;
            
            //KEY EXISTS
            if (keyValue !== undefined) {
                
                keyArray    = JSON.parse(keyValue); //get key array
                value       = keyArray[0];
                dataType    = keyArray[1];
                
                if (
                    bucket.config.getterMode === 1 &&
                    dataType !== undefined
                    ) {
                    //return as-stored
                    if (dataType == 'number')            { return Number(value) } //Number
                    else if (dataType == 'object')       { return JSON.parse(value) } //Object
                    else if (dataType == 'boolean')      {
                        if (value=='true')               { return true }
                        if (value=='false')              { return false }
                    }
                    else if (dataType == 'undefined')    { return undefined } //undefined
                    else if (dataType == 'function')     { return value } //function. returned as string
                    
                    return value; //pass string if none other amtch
                }
                else {
                    //convert to proper data-type
                    return fn.parse (value);
                }
            }
            else {
                return undefined
            }
            
        }
        
        //return entire bucket
        else {
            return bucket.get(this.bucketName);
        }
    },
    
    //REMOVER
    remove: function(key){
        
        //prepare event object
        var event = {
            bucket: this.bucketName,
            key: key
        };
        
        //remove specific key
        if (key) {
            localStorage.removeItem(JSON.stringify( [ bucket.config.suffix, this.bucketName, key ] ));
            
            //subtract 1 from expKeys
            //if all keys are removed it becomes 0
            var expKeys = (localStorage['Bucket--ExpKeys'] == undefined) ? 0 : Number(localStorage['Bucket--ExpKeys']);
            if (expKeys > 0) {
                localStorage['Bucket--ExpKeys'] = expKeys - 1;
            }
        }
        
        //remove entire bucket
        else {
            bucket.remove(this.bucketName);
        }
        
        //run event functions
        for(var x=0, l=bucket.events.remove.length; x<l; x++){
            bucket.events.remove[x](event); //event as argument
        }
    }
    
};

//Bucket Events
bucket.events = { set:[], remove:[] };

//Bucket Events function binder
bucket.on = function(eventName, fn) {
    eventName = eventName.toLowerCase();
    if (bucket.events[eventName]) {
        bucket.events[eventName].push(fn)
    }
    else {
        console.error('Bucket: Invalid event "'+eventName+'"');
    }
};

//GETTER
bucket.get = function(bucketName){
    
    var value = {};
    
    //return entire Bucket storage
    if (bucketName == undefined) {
        
        for (var key in localStorage) {
            //is it a bucket item
            if (fn.isBucket(key)) {
                
                var keyArray;
                
                keyArray        = JSON.parse(key);
                bucketName      = keyArray[1];
                thisBucket      = bucket(bucketName);
                keyName         = keyArray[2];
                
                if (value[bucketName] == undefined) {
                    //create object bucket if it doesn't already exist
                    value[bucketName] = {}
                }
                
                //add value to object
                value[bucketName][keyName] = thisBucket.get(keyName);
            }
        }
    }
    
    //return specified bucket
    else {
        for (var key in localStorage) {
            
            if (fn.isBucket(key, bucketName)) {
                var keyArray, keyName;
                
                keyArray            = JSON.parse(key);
                bucketName          = keyArray[1];
                keyName             = keyArray[2];
                
                value[keyName]  = bucket(bucketName).get(keyName);
            }
        }
    }
    
    //check for empty Object
    for (var item in value) {
        if (value.hasOwnProperty(item)) {
            return value
        }
    }
    
    return undefined
}

//REMOVE A BUCKET
bucket.remove = function(bucketName){
    
    //if bucketname is passed
    if (bucketName != undefined) {
        
        for (var key in localStorage) {
            
            //check if current key is target bucket's item
            if (fn.isBucket(key, bucketName)) {
                
                var KeyArray = JSON.parse(key);
                
                //KeyArray[1]=bucketname
                //KeyArray[2]=key
                bucket(KeyArray[1]).remove(KeyArray[2]);
                
            }
        }
        
    }
    
    else {
        //nope
        throw new Error("Bucket: bucketName not defined")
    }
    
};

//Remove keys that have expired
bucket.removeExpired = function(time){
    
    var timeNow = (time !== undefined) ? time : new Date();
    
    for (var key in localStorage) {
        
        //current key is a bucket item?
        if ( fn.isBucket(key) ) {
            
            var valueArray = JSON.parse(localStorage[key]);
            
            if (valueArray.length == 3) { //3rd item is age
                var
                keyArray        = JSON.parse(key),
                bucketName      = keyArray[1],
                keyName         = keyArray[2],
                expiryDate      = new Date(JSON.parse(valueArray[2])),
                timeRemaining   = expiryDate.getTime() - timeNow.getTime();
                
                if (timeRemaining<=0) {
                    //remove if its expired
                    bucket(bucketName).remove(keyName)
                }
                
            }
        }
    }
}

if (Number(localStorage['Bucket--ExpKeys']) > 0 ) {
    bucket.removeExpired();
}


})();