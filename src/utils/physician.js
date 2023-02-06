import axios from 'axios'
import { useMutation, useQuery, useQueryClient, useQueries } from 'react-query'
import { getPhyQuestions, getDatastreams, getPhyName, getImageUrl, getImageUrls } from '../../api/http';

export const physicianQuestions = () => {
    const phyQuestions = useQuery('physician-questions', getPhyQuestions, {
        // onSuccess: () => {console.warn("fetched physians questions")},
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,
        refetchOnMount: "always"

    });
    return phyQuestions;
}

export const phyResponses = () => {
    const res = useQuery('physician-responses', () => getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire"), {
        // onSuccess: () => {console.warn("fetched physician responses")},
        refetchOnMount: "always",
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,

    });
    return res;
}

// get phy name based on id
export const getPhyNameFromId = (phyId) => {
    const res = useQuery(["physician-name", phyId], () => getPhyName(phyId), {
        // onSuccess: () => {console.warn("fetched physician name")},
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,

    });
    return res;
}
export const userImageResponses = (imageResponses) => {
  const res = useQueries(

    Object.keys(imageResponses[0]).map(k => {
        // console.error(imageResponses[0][k])
        return {
            queryKey: k,
            queryFn: () => getImageUrls(imageResponses[0][k]),
            // staleTime: 780000
        }

    })
  )
  return res
}
// export const userImageResponses =  () => {
//     // try {
//     //     imageResponses.map(response => {
//     //         console.error(response)
//     //     })
//     // } catch (error) {
//     //     console.error(error)
//     // }
//         let imageResponsesForPhy = []

//     const getPhysicianResponses = async () => {
//         let response =  await getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire");
//         return response
//     }
//      getPhysicianResponses().then((response) => {
//         var result = response.data.reduce(function (r, a) {
//             r[a.source.split(":")[1]] = r[a.source.split(":")[1]] || [];
//             r[a.source.split(":")[1]].push(a);
//             return r;
//         }, Object.create(null));
        
//           for (var phyId of Object.keys(result)) {
    
//             let temp = []
//             for(var responses of result[phyId]){
//               for(var userRes of responses['value']){
//                 if(userRes['response_type'] == 'image'){
//                   // temp.push([userRes,userRes['question_id']])
//                   imageResponsesForPhy.push([phyId,userRes['question_id'], userRes['value']])
//                 }
//               }
//             }
//         }

       
    
//      });


    
//      if(imageResponsesForPhy.length > 0){
//         const res = useQueries(
//             imageResponsesForPhy.map(res => {
//               return {
//                 queryKey: ['image-response', res[0]],
//                 queryFn: () => getImageUrl(res[2])
//               }
//             })
//           )

//         return res; 
//         }
        

   
    
// }