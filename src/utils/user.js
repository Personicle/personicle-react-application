import React, {useState,useEffect} from 'react';
import axios from 'axios'
import { useMutation, useQuery, useQueryClient , } from 'react-query'
import { getUserInfo, updateUserInfo, getImageUrl, uploadProfilePic } from '../../api/http';
import { showMessage } from 'react-native-flash-message';

   export const userProfileData = () => {
        const profileData = useQuery('user-profile-data',getUserInfo, {
            onSuccess: ()=> {
                // console.warn("on success use query user profile data fetched")
            },
            
            // cacheTime: 1000 * 60 * 60 * 24,
            // refetchIntervalInBackground: true,
            // refetchInterval: 60 * 1000 * 20,
            // staleTime: 60 * 1000 * 60 * 24 // data will be considered state after 2 minutes
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
            // onSuccess: () => {console.warn("on success user profile image url fetched")},

            // refetchIntervalInBackground: true,
            // refetchInterval: 60 * 1000 * 12,
            cacheTime: 1000 * 60 * 60 * 24,
            staleTime: 1000 * 60 * 60 * 24,

            
            // refetchOnMount: "always"
          });
  
        return profileImage;
      } catch (error) {
          // console.error(error)
      }
      
  }

  export const updateUserProfileImage = async (image) => {
      // try {
        const res = await uploadProfilePic(image);
        if(res['status'] != 422){
           const key =  res['data'][0]['image_key']
           let payload = {}
           payload["image_key"] = key
           const r = updateUserInfo(payload);
           
           return r; 
        }  else {
            throw `${res['error']}`;
        }
  }
  
   
    
