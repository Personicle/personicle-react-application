import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import TimelineScreen from "./screens/TimelineScreen";
import FoodLogScreen from "./screens/FoodLogScreen";
import SleepLogScreen from "./screens/SleepLogScreen";
import PhysicianQuestionScreen from "./screens/PhysicianQuestionScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// const Stack = createNativeStackNavigator();

// const Drawer = createDrawerNavigator();

export const LoginStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Connections" component={ConnectionScreen} />
      <Drawer.Screen name="Timeline" component={TimelineScreen} />
      <Drawer.Screen name="Food Logging" component={FoodLogScreen} />
      <Drawer.Screen name="Sleep Logging" component={SleepLogScreen} />
      <Drawer.Screen
        name="Physician Questionnaire"
        component={PhysicianQuestionScreen}
      />
    </Drawer.Navigator>
  );
};
