import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DrawerNavigator from "./DrawerNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import WelcomeScreen from "./screens/WelcomeScreen"; // Import WelcomeScreen

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const PERSISTENCE_KEY = "NAVIGATION_STATE";
  const FIRST_TIME_KEY = "isFirstTimeApp"; // Key to track if it's the first time app is opened

  useEffect(() => {
    const setupApp = async () => {
      try {
        // ===== DEVELOPMENT ONLY: Clear all AsyncStorage on every app start =====
        AsyncStorage.clear(); // ⚠️ DELETE OR COMMENT THIS LINE AFTER TESTING

        const firstTime = await AsyncStorage.getItem(FIRST_TIME_KEY);

        if (firstTime === null) {
          setIsFirstTime(true);
          await AsyncStorage.setItem(FIRST_TIME_KEY, "false");
        } else {
          setIsFirstTime(false);
        }

        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;

        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (error) {
        console.error("Error during setup:", error);
      } finally {
        setIsReady(true);
      }
    };

    setupApp();
  }, []);

  if (!isReady) return null; // You can return a loading spinner here

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Stack.Navigator initialRouteName={isFirstTime ? "Welcome" : "Login"}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{
            title: "Add Expense",
            headerStyle: {
              backgroundColor: "#0f172a",
            },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
