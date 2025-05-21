import axios from 'axios'

/*exports a function commonAPI that takes in httpMethod,url,reqBody,reqHeader and returns a result
after making an api call using axios */
export const commonAPI = async (httpMethod,url,reqBody,reqHeader)=>{
    
    let reqConfig={
        method:httpMethod,
        url,
        data:reqBody,
        headers:reqHeader?reqHeader:{"Content-Type":"application/json"},
        
    }
    // response from API call using axios with reqConfig as argument is returned by the commonAPI function.
    return await axios(reqConfig).then(
        result=>{return result}
    ).catch(err=>{return err})
}
// ,'ngrok-skip-browser-warning': 69420