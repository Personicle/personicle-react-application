import { useMutation, useQuery, useQueryClient , } from 'react-query'
import { getUserEvents } from '../../api/http';

export const getEvents = () => {
    const userEvents = useQuery('user-events', getUserEvents, {
        onSuccess: ()=> {
            console.warn("on success user events called")
        },
    }) 
    return userEvents;

}