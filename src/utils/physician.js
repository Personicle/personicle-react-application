import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getPhyQuestions, getDatastreams, getPhyName } from '../../api/http';

export const physicianQuestions = () => {
    const phyQuestions = useQuery('physician-questions', getPhyQuestions, {
        onSuccess: () => {console.warn("fetched physians questions")},
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,
        refetchOnMount: "always"

    });
    return phyQuestions;
}

export const phyResponses = () => {
    const res = useQuery('physician-responses', () => getDatastreams(datatype="com.personicle.individual.datastreams.subjective.physician_questionnaire"), {
        onSuccess: () => {console.warn("fetched physician responses")},
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,

    });
    return res;
}

// get phy name based on id
export const getPhyNameFromId = (phyId) => {
    const res = useQuery(["physician-name", phyId], () => getPhyName(phyId), {
        onSuccess: () => {console.warn("fetched physician name")},
        // refetchIntervalInBackground: true,
        // refetchInterval: 15 * 1000 ,

    });
    return res;
}