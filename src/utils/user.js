import React, {useState,useEffect} from 'react';
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserInfo, updateUserInfo, getImageUrl } from '../../api/http';

   export const userProfileData = () => {
        const profileData = useQuery('user-profile-data',getUserInfo, {
            onSuccess: ()=> {
                console.warn("on success use query user profile data fetched")
            },
            refetchIntervalInBackground: true,
            refetchInterval: 60 * 1000 ,
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
            staleTime:  60 * 1000 * 12
          });
  
        return profileImage;
      } catch (error) {
          console.error(error)
      }
      
  }
  
   
    
