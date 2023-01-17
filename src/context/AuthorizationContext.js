import { signIn, signOut, signInWithBrowser, getUser, revokeAccessToken, clearTokens} from "@okta/okta-react-native";
import createDataContext from "./createDataContext";
import * as SecureStore from "expo-secure-store";
import { stopLocationTracking } from "../utils/location";
import { introspectAccessToken, refreshTokens }  from "@okta/okta-react-native";
import { useQueryClient } from 'react-query';

export const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload.errorMessage };
    case "sign_in":
      // take sign in action
      console.log("sign in action"); 

      return {
        token: action.payload.token.access_token,
        logged_in: true,
        errorMessage: "",
        isLoading: false
      };
    // upon success return new state else log error and return existing state

    case "sign_out":
      return { token: null, logged_in: false, errorMessage: "" , isLoading: false};

    case "sign_up":
      return state;
    case "RESTORE_TOKEN":
      return {
        token: action.payload.token,
        logged_in: true,
        errorMessage: "",
        isLoading: false
      }
    default:
      return state;
  }
};

const handleError = (dispatch) => {
  return (message) => {
    dispatch({ type: "add_error", payload: { errorMessage: message } });
  };
};

const login = (dispatch) => {
  return async (userEmail, password) => {
    console.log("sign in triggered");
    try {
      const token = await signIn({
        username: userEmail,
        password: password,
      });

      console.log("sign in success");

      await SecureStore.setItemAsync("token", token.access_token);
      let user = await getUser();
      await SecureStore.setItemAsync("user_id", user['sub']);

      await dispatch({ type: "sign_in", payload: { logged_in: true, token } });
      // RootNavigation.na
      // navigate("Profile");
      // RootNavigation.navigate("Profile");
    } catch (error) {
      console.log(error.message);

      dispatch({
        type: "add_error",
        payload: {
          errorMessage: `Error while signing in ${error.message}`,
        },
      });
    }
  };
};

const googleSignIn = (dispatch) => {
  return async () => {
    console.log("google sign in triggered");
    try {
      
      const token = await signInWithBrowser({ idp: '0oa3v658b8VCLoy3L5d7', noSSO: true  });

      console.log("sign in success");
      await SecureStore.setItemAsync("token", token.access_token);
      let user = await getUser();
      await SecureStore.setItemAsync("user_id", user['sub']);

      
      await dispatch({ type: "sign_in", payload: { logged_in: true, token } });
      // navigate("Profile");
      
      // RootNavigation.navigate('Profile')
    } catch (error) {
      console.log(error.message);

      dispatch({
        type: "add_error",
        payload: {
          errorMessage: `Error while signing in ${error.message}`,
        },
      });
    }
  };
};

const signUp = (dispatch) => {
  return async () => {
    console.log("google sign in triggered");
    try {
      const token = await signInWithBrowser();

      console.log("sign in success");

      await SecureStore.setItemAsync("token", token.access_token);
      let user = await getUser();
      await SecureStore.setItemAsync("user_id", user['sub']);

      await dispatch({ type: "sign_in", payload: { logged_in: true, token } });
      // navigate("Profile");
    } catch (error) {
      console.log(error.message);

      dispatch({
        type: "add_error",
        payload: { errorMessage: `Error while signing in ${error.message}` },
      });
    }
  };
};

const logout = (dispatch) => {
  const queryClient = useQueryClient();
  queryClient.removeQueries();
  return async () => {
    try {
     
      await revokeAccessToken();
     
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user_id");


      await signOut();
      stopLocationTracking();
      dispatch({ type: "sign_out" });
      // RootNavigation.navigate("Login")

      // navigate("Login");
      // RootNavigation.navigate("Login");
    } catch (err) {
      console.error(err);
      dispatch({ type: "add_error", payload: { errorMessage: err.message } });
    }
  };
};


export const refreshAllTokens = async () => {
  try {
    

  const refresh_tokens = await refreshTokens();
  console.error("refresh token");

  if(refresh_tokens == null){
    return false;
  }
  await SecureStore.setItemAsync("token", refresh_tokens.access_token);
  await SecureStore.setItemAsync("refresh_token", refresh_tokens.refresh_token); 
  return true;
  } catch (error) {
    console.error(error)
    return false;
  }
  
}
export const isAuthed = async() =>{
  try {
    const token = await SecureStore.getItemAsync("token");
    const tokenIsActive = await introspectAccessToken(token); //  throws error


    if(tokenIsActive["active"]){
      return true;
    } else {
      const res = await refreshAllTokens();
      if(res)
        return true;
      return false
    }
    
  } catch (error) {
    const res = await refreshAllTokens();
   
    if(res)
      return true;
    
    return false;
    
  }
}


export const autoLogin = (dispatch) => {
  return async () => {
    if (await isAuthed()){
       const access_token = await SecureStore.getItemAsync("token");
       const token = {
        "access_token" : access_token
      }
      await dispatch({ type: "sign_in", payload: { logged_in: true, token } });
      return true; 
    }
    await dispatch({ type: "sign_out" });
    return false;
  }
}

export const { Context, Provider } = createDataContext(
  authReducer,
  { login, logout, googleSignIn, signUp, autoLogin},
  { logged_in: false, token: null, errorMessage: "" , isLoading: true}
);
