//Return the code of the response only. Errors all set to 400 or parse as needed.
function urlStatusCode(url){
  let responseCode = null;
  try{
    responseCode = UrlFetchApp.fetch(url).getResponseCode();
  }catch(err){
    responseCode = 400;
  }
return responseCode;
}


//Check if a URL has a valid endpoint and return true or false for display as checkboxes.
function checkUrl(url){
  //init a variable to hold the current status. 
  let status = null;

  //This is the list of acceptable HTTPResponse codes returned by the .getResponseCode() method
  //A list of HTTPResponse codes can be found here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  //Alternatively we could check for ranges instead of the individual codes. 
  const goodUrlCodes = [200,204,201,206];

  try{
    //URLFetchApp calls googles services to perform the fetch() call
    //Google services limits the amount of times this function can be called: 20k on personal accts and 100k per day on business
   let responseCode = UrlFetchApp.fetch(url).getResponseCode();
    
    //Check if the response code received matches any in the goodUrlCodes array
    if(responseCode && goodUrlCodes.find((elem) => elem = responseCode) === responseCode){
      status = true;
    }else{
      status = false
    }
  }catch(err){
    //If there is ANY error set the value to false
    status = false;
  }
  //return the value of status which will be an enum: True, False or null
  return status;
}

//This function calls and sets the cache for future calls if working with a large volume of links
function checkUrlCache(url){
  
  let status = null;

  const goodUrlCodes = [200,204,201,206];

  //This is for caching responses to avoid hitting the daily quotas on refeshing the browser 
  let cache = CacheService.getScriptCache();
  let cached = cache.get(url);
  if(cached && goodUrlCodes.find((elem) => elem = cached) === cached){
    status = true;
    return status;
   }

  try{

   let responseCode = UrlFetchApp.fetch(url).getResponseCode();  
   //Store the response in cache if the 
   cache.put(url,responseCode, 21600);

    if(responseCode && goodUrlCodes.find((elem) => elem = responseCode) === responseCode){
      status = true;
    }else{
      status = false
    }
  }catch(err){ 
    status = false;
  }
  return status;
}
