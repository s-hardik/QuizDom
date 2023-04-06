import React, { useState, useEffect } from 'react'
import './Home.css'
import { StyledFirebaseAuth } from 'react-firebaseui'
import firebase from '../firebase/firebase'
import LoadingScreen from './LoadingScreen'
import { useLocation } from 'react-router-dom'

const Home = ({ setUser }) => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [checked, setChecked] = useState(false);
	function handleChange(e){
		setChecked(e.target.checked);
	}
	
	var uiConfig = {
		signInflow: 'popup',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
		],
		callbacks: {
			signInSuccessWithAuthResult: () => false,
		},
	}
	 useEffect(() => {
		let isMounted = true
		
		firebase.auth().onAuthStateChanged(async (user) => {
			// setIsLoggedIn(!!user)
			const getAuthdetails = async () => {
				try {
					const response = await fetch(`/API/users/getUserRole/${firebase.auth().currentUser.uid}`);
					const data = await response.json();
					console.log(data);
					console.log('Role accessed successfully');
					return  data.isAdmin;		
					} catch (error) {
						console.log('Role fetching failed: ', error);
					}
			}
			let isAdmin = await getAuthdetails();
			if (user && isMounted) {
				setUser({
					uid: firebase.auth().currentUser.uid,
					name: firebase.auth().currentUser.displayName,
					email: firebase.auth().currentUser.email,
					isAdmin: isAdmin
				})
				console.log('User Logged In')
			} else {
				console.log('User Signed Out')
				setUser({})
			}
			console.log('auth change')
			if (isMounted) setLoading(false)
		})
		return () => (isMounted = false)
	}, [setUser,checked])
	return (
		<>
			{loading ? (
				<LoadingScreen />
			) : (
				<div id='Home'>
					<div id='logo'>
						<div id='logo-name'>
							<b>Quiz</b>dom
						</div>
						<div id='description'>
							Now create and join quiz at a single platform.You can create
							trivia quizzes, personality test, polls and survays. Share out
							your quiz with your students with a unique code.
						</div>
					</div>

					<div id='login-card'>
						<label className='login-label'>
							<b>Q</b>
						</label>
						{location.pathname==='/admin'?<div>
						<input type="checkbox" id="admin" name="admin" checked={checked} onChange={handleChange}/>
						<label className='login-text' for="admin">Sign in as Admin</label>
						</div>:"" }
						<StyledFirebaseAuth
							borderRadius='40px'
							uiConfig={uiConfig}
							firebaseAuth={firebase.auth()}
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default Home
