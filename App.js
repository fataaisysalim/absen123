import React, { useState,useEffect } from 'react';
import { Alert,StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';

function App() {
	const [webUrl, setWebUrl] = useState('https://mobile.absen123.com/auth');
	async function requestUserPermission() {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		
		if (enabled) {
			console.log('Authorization status:', authStatus);
		}
	}

	async function getToken(){
		const fcmToken = await messaging().getToken();
		setWebUrl('https://mobile.absen123.com/auth?fcm_token='+fcmToken);
		console.log(fcmToken);
	}

	useEffect(() => {
		requestUserPermission();
		getToken();

		// const unsubscribe = messaging().onMessage(async remoteMessage => {
		// 	Alert.alert('A new FCM message arrived!', remoteMessage.notification?.body);
		// });
		
		messaging().setBackgroundMessageHandler(async remoteMessage => {
			// console.log('Background Message:', remoteMessage.notification?.body); 
		});
	  
		messaging().onNotificationOpenedApp(remoteMessage => {
			if(remoteMessage.notification?.title.toLowerCase().includes("tugas")){
				setWebUrl('https://mobile.absen123.com/task');
			}
		});

		messaging()
		.getInitialNotification()
		.then(remoteMessage => {
			if (remoteMessage) {
			console.log(
				'Notification caused app to open from quit state:',
				remoteMessage.notification,
			);
			// setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
			}
		});
	  
	},[])

	return (
		<>
			<StatusBar translucent backgroundColor="transparent" />
			<WebView source={{ uri: webUrl }}/>
		</>
	);
}

export default App;
