
import eventRead, { getToken, getUserId } from "./interceptors"
import getPhysiciansQuestions from "./interceptors"
import { getUser } from "@okta/okta-react-native";
import axios from 'axios';
import moment from 'moment';
import RNHeicConverter from 'react-native-heic-converter';
export async function getUserEvents(){
    try {
        const res = await eventRead();
        return res
    } catch (error) {
        console.error(error)
    }
}

export const uploadImage = async (image) => {
    const formData = new FormData();
    const uid = await getUserId();
    let uri = Platform.OS === 'android' ? image : image.replace('file://', '');
    const t = image.lastIndexOf("/")

    try {
        let filename = image.substring(t+1,image.length);
        const extension = filename.substring(filename.length - 4);
        if(extension == "HEIC") {
            
            const res = await RNHeicConverter.convert({path: uri})
            console.error(res.path)
            uri = res.path
        }
    } catch (error) {
        console.error(error)
    }
   
    formData.append('user_image[images][]', {
        uri: uri,
        name: `image-${uid}`,
        type: image['mime']
    })
     formData.append("user_image[individual_id]", uid);
      try {
        const res = await axios.post('https://personicle-file-upload.herokuapp.com/user_images' , formData, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`,
               'Content-Type': 'multipart/form-data'
              }
          })
       
          return res
      } catch (error) {
        // console.error(error.response)
        return  {'error': error.response.data, 'status': error.response.status}

        
      }
      
}
export const uploadProfilePic = async (image) => {
    const formData = new FormData();
    const uid = await getUserId();
    formData.append('user_image[images][]', {
        uri: Platform.OS === 'android' ? image['sourceURL'] : image['sourceURL'].replace('file://', ''),
        name: `image-${uid}`,
        type: image['mime']
    })
     formData.append("user_image[individual_id]", uid);
      try {
        const res = await axios.post('https://personicle-file-upload.herokuapp.com/user_images' , formData, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`,
               'Content-Type': 'multipart/form-data'
              }
          })
       
          return res
      } catch (error) {
        console.error(error.response)
        return  {'error': error.response.data, 'status': error.response.status}

        return error
      }
      
}

export async function getImageUrl(imageKey){
    try {
        const uid = await getUserId();
        const res = await axios.get(`https://personicle-file-upload.herokuapp.com/user_images/${imageKey}?user_id=${uid}`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        // console.error(res)
        
        return res
    } catch (error) {
        console.error(error)
    }
}
export async function getImageUrls(imageKeys){
    try {
        
        console.error("network call get image urls")
        const uid = await getUserId();
        let urls = []

        
        for(const key of imageKeys){
            const res = await axios.get(`https://personicle-file-upload.herokuapp.com/user_images/${key[0]}?user_id=${uid}`, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                  }
               })

               res['data']['timestamp'] = key[1] // add timestamp key
               
               urls.push(res) 
        }
        console.error("urls")
        
        console.error(urls)
        
        return urls
    } catch (error) {
        console.error(error)
    }
}

export async function getPhyQuestions(){
    try {
        const res = await axios.get('https://app.personicle.org/physician/questions', {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        // console.error(res)
        
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function updateUserInfo(data) {
  
    try {
        const res = await axios.post('https://app.personicle.org/api/update/user', data, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function getUserInfo() {
    try {
        // console.error("network call get user info")
        const res = await axios.get('https://app.personicle.org/api/user', {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function getPhyName(phyId){
    try {
        const res = await axios.get(`https://app.personicle.org/api/physician/${phyId}`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)  
        return  {'error': error.response.data, 'status': error.response.status}
              
    }
}

export async function addPhysiciansToUser(physicians){
    try {
        // physicians is a list of physician ids
        const data_packet = {"physicians": physicians}
        const res = await axios.post('https://app.personicle.org/api/user/physicians', data_packet, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)
        return {'error': error.response.data, 'status': error.response.status}
        
    }
}

export async function removePhysiciansFromUser(physicians){
    try {
        // physicians is a list of physician ids
        const data_packet = {"physicians": physicians}
        const res = await axios.post('https://app.personicle.org/api/user/physicians/remove', data_packet, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)
        return {'error': error.response.data, 'status': error.response.status}
        
    }
}

export async function getAllPhysicians(){
    try {
        const res = await axios.get(`https://app.personicle.org/api/physicians/all`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)        
    }
}

// get physicians for a user
export async function getUsersPhysicians(){
    try {
        const res = await axios.get(`https://app.personicle.org/api/physicians`, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)        
    }
}

export async function sendPhysicianResponses (data_packet){
    console.error(data_packet)
    try {
        const res = await axios.post('https://api.personicle.org/data/write/datastream/upload', data_packet, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`
              }
        })
        return res
    } catch (error) {
        console.error(error)
    }
}


export async function getDatastreams(datatype,dataSource=undefined,start=undefined, end=undefined){

    try {
        const token = await getToken();
        const userId = await getUserId();
   
        let params = {}
        const endTime = end === undefined ? moment().utc().format("YYYY-MM-DD HH:mm:ss.SSSSSS").toString() : end 
        const startTime = end === undefined ? moment().utc().subtract(3,'months').format("YYYY-MM-DD HH:mm:ss.SSSSSS").toString() : start 

        if (dataSource == undefined){
            params = {
                datatype: datatype,
                startTime: startTime,
                endTime: endTime,
                user_id: userId
            };
        }else {
            params = {
                datatype: datatype,
                source: dataSource,
                startTime: startTime,
                endTime: endTime,
                user_id: userId
            };
        }
       
        let config = {}
        config['params'] = params;
        config['headers'] = {
            'Authorization': `Bearer ${token}`
        }
        const res = await axios.get('https://api.personicle.org/data/read/datastreams', config)
        // console.error(res)
        return res
    } catch (error) {
        console.error(error)
    }
}