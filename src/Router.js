import { NavigationContainer } from "@react-navigation/native";

import { LoginStack, AppStack } from "./navigationStacks";
import { Context } from "./context/AuthorizationContext";
import { navigationRef } from "./RootNavigation";

import { useContext } from "react";

export default () => {
  const { state } = useContext(Context);
  return (
    <NavigationContainer ref={navigationRef}>
      {state.token ? <AppStack /> : <LoginStack />}
    </NavigationContainer>
  );
};
