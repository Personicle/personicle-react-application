import React, {useState,useEffect} from 'react';
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserInfo, updateUserInfo, getImageUrl, uploadProfilePic } from '../../api/http';

   export const userProfileData = () => {
        const profileData = useQuery('user-profile-data',getUserInfo, {
            onSuccess: ()=> {
                console.warn("on success use query user profile data fetched")
            },
            refetchIntervalInBackground: true,
            refetchInterval: 60 * 1000 * 20,
            // staleTime: 60 * 1000 * 2 // data will be considered state after 2 minutes
        })
        // console.error(profileData)
        return profileData;
   }


   async function getProfileImageUrl(){
    const r = await getUserInfo();
    const imageKey = r['data']['info']['image_key'];
    const res = await getImageUrl(imageKey);
    const url = res['data']['image_url'];
    return url;
  }

  export const userProfileImage = () => {
      try {
        const profileImage = useQuery("user-profile-image", () => getProfileImageUrl(), { 
            onSuccess: () => {console.warn("on success user profile image url fetched")},
            keepPreviousData: true,
            refetchIntervalInBackground: true,
            refetchInterval: 60 * 1000 * 12,
            refetchOnMount: "always"
          });
  
        return profileImage;
      } catch (error) {
          console.error(error)
      }
      
  }

  export const updateUserProfileImage = async (image) => {
      // try {
        const res = await uploadProfilePic(image);
        console.error("hola")

        console.error(res)
        if(res['status'] != 422){
          console.error(res['status'])
           const key =  res['data'][0]['image_key']
           let payload = {}
           payload["image_key"] = key
           const r = updateUserInfo(payload);
           
           return r; 
        }  else {
          throw `${res['error']}`;
        }
      // } catch (error) {
      //     console.error("herre")
      //     console.error(error)

      //     return error
      //     console.error(error)
      // }
  }
  
   
    
