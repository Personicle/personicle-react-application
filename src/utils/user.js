import React, {useState,useEffect} from 'react';
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserInfo, updateUserInfo } from '../../api/http';



   export const userProfileData = () => {
        const profileData = useQuery('user-profile-data',getUserInfo, {
            onSuccess: ()=> {
                // console.warn("on success use query")
            },
            refetchIntervalInBackground: true,
            refetchInterval: 15000,
        })
        // console.error(profileData)
        return profileData;
   }
  
   
    
