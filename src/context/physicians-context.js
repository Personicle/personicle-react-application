import { createContext } from "react";
import {useReducer} from 'react';


export const PhysiciansContext = createContext({
    physician: [],
    submitResponses: (responses) => {
    },
    setResponse: () => {

    }
});
function physiciansReducer(state, action){
    switch (action.type){
        case 'SUBMIT':
            console.error(action.payload);
            return [{...action.payload},...state]
        default:
            return state;
    }
}
function PhysiciansContextProvider({children}){
    const [state, dispatch] = useReducer(physiciansReducer, '');

    function submitResponses(responses){
        dispatch({type: 'SUBMIT', payload: responses});
    }
    const value = {
        repsonses: state,
        submitResponses: submitResponses,
    }
    return <PhysiciansContext.Provider value={value}>{children}</PhysiciansContext.Provider>
}

export default PhysiciansContextProvider;