import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import TimelineScreen from "./screens/TimelineScreen";
import FoodLogScreen from "./screens/FoodLogScreen";
import SleepLogScreen from "./screens/SleepLogScreen";
import VisualizeResponses from "./screens/VisualizeResponses";
import PhysicianQuestionScreen from "./screens/PhysicianQuestionScreen";
import TimelineScreenWeekly from "./screens/TimelineScreenWeekly";
import AllResponses from "./screens/AllResponses";
import { Text, View } from "react-native";
import PhysiciansQues from "./screens/PhysiciansQues";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabRoutes(){
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Timeline') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        
        >
        <Tab.Screen name="Daily" component={TimelineScreen} options={{header: () => null}}/>
        <Tab.Screen name="Weekly" component={TimelineScreenWeekly} options={{header: () => null}} />

      </Tab.Navigator>
  )
}

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
  const Stack = createNativeStackNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Connections" component={ConnectionScreen} />
      <Drawer.Screen name="Timeline" component={TabRoutes} />
      <Drawer.Screen name="Food Logging" component={FoodLogScreen} />
      <Drawer.Screen name="Sleep Logging" component={SleepLogScreen} />
        <Drawer.Screen
          name="Physician Questionnaire"
          component={PhysiciansQuestion}
        >
           {/* <Stack.Navigator  initialRouteName="PhysiciansQues"> */}
            {/* <Stack.Screen name="PhysiciansQues" component={PhysiciansQues} /> */}
          {/* </Stack.Navigator> */}
          </Drawer.Screen>

      <Drawer.Screen name="Visualize Response" component={Visualize} />

    </Drawer.Navigator>
    
  );
};

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
export const SplashStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen name="Loading" component={SplashScreen} />
    </Stack.Navigator>
  );
};
export const Visualize = () =>{
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator  initialRouteName="Visualize Responses">
      <Stack.Screen name="Visualize Responses" component={VisualizeResponses} options={{header: () => null}}/>
      <Stack.Screen name="Responses Visualization" component={AllResponses} options={{header: () => null}}/>
    </Stack.Navigator>
  );
};
export const PhysiciansQuestion = () =>{
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator  initialRouteName="Physician Questionnaire">
      <Stack.Screen name="Physician Questionnaire" component={PhysicianQuestionScreen} options={{header: () => null}}/>
      <Stack.Screen name="Questionnaire" component={PhysiciansQues} options={{ presentation: 'modal'}}/>
    </Stack.Navigator>
  );
};