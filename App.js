import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './components/SignIn';
import FrontPage from './components/FrontPage';
import Register from './components/Register';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';
import CheckHealth from './components/CheckHealth';
import Comment from './components/Comment';
import ReactPage from './components/ReactPage';
import Notification from './components/Notification';
import Upload from './components/Upload';
import Rating from './components/Rating';
import CommentList from './components/CommentList';
import EmailVerification from './components/EmailVerification';
import RatingList from './components/RatingList';
import PatientInfo from './components/PatientInfo';
import EmbedVedio from './components/EmbedVedio';



export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='FrontPage'>
        <Stack.Screen name='FrontPage' component={FrontPage} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='SignIn' component={SignIn} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        <Stack.Screen name='HomePage' component={HomePage} />
        <Stack.Screen name='CheckHealth' component={CheckHealth} />
        <Stack.Screen name='Comment' component={Comment} />
        <Stack.Screen name='ReactPage' component={ReactPage} />
        <Stack.Screen name='Notification' component={Notification} />
        <Stack.Screen name='Upload' component={Upload} />
        <Stack.Screen name='Rating' component={Rating} />
        <Stack.Screen name='CommentList' component={CommentList} />
        <Stack.Screen name='EmailVerification' component={EmailVerification} />
        <Stack.Screen name='RatingList' component={RatingList} />
        <Stack.Screen name='PatientInfo' component={PatientInfo} />
        <Stack.Screen name='EmbedVedio' component={EmbedVedio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
