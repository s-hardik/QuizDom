import { Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import firebase from './firebase/firebase';

// Stylesheet
import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
// Components
import Home from './screens/Home';
import OneTimeDashBoard from './screens/OneTimeDashboard';
import CreateQuiz from './screens/CreateQuiz';
import JoinQuiz from './screens/JoinQuiz';
import UserDashboard from './screens/UserDashboard';
import CreatedSuccesfully from './screens/CreatedSuccesfully';
import NotFoundPage from './screens/NotFoundPage';
import AttemptQuiz from './screens/AttemptQuiz';
import Appbar from './components/Appbar';
import Responses from './screens/Responses';
import AttemptBlindQuiz from './screens/AttemptBlindQuiz';

const App = () => {
	const [user, setUser] = useState({});
	const [isAdmin, setIsAdmin] = useState(false);
	
	useEffect(() => {
		const createUserInDB = async () => {
			if (user.uid)
				if (
					firebase.auth().currentUser.metadata.lastSignInTime ===
					firebase.auth().currentUser.metadata.creationTime
				) {
					try {
						await fetch('/API/users/create', {
							method: 'POST',
							body: JSON.stringify({
								uid: user.uid,
								name: user.name,
								email: user.email,
								isAdmin: user.isAdmin,
							}),
							headers: {
								'Content-Type': 'application/json',
							},
						});

						console.log('posted');
					} catch (error) {
						console.log('User Creation Error: ', error);
					}
				}
		};
		createUserInDB();
		setIsAdmin(user.isAdmin);
	}, [user]);
	console.log(user);
	return (
		<div className="App">
			{!firebase.auth().currentUser ? (
				<Route path={isAdmin ? '/admin' : '/'}>
					<Home setUser={setUser}  />
				</Route>
			) : (
				<>
					<div>
						<Appbar user={user} setUser={setUser} isAdmin={isAdmin} />
					</div>
					<Switch>
						
						<Route exact path="/">
							<OneTimeDashBoard user={user} isAdmin={isAdmin} />
						</Route>
						<Route path="/dashboard">
							<UserDashboard user={user} isAdmin={isAdmin} />
						</Route>
						{isAdmin? <>
							<Route path="/create-quiz">
							<CreateQuiz user={user} />
						</Route>
						<Route
							path="/created-succesfully/:quizCode"
							component={CreatedSuccesfully}
						/>
						<Route path="/responses/:quizCode" component={Responses} />
						</>:""}
						
						<Route path="/join-quiz">
							<JoinQuiz user={user} />
						</Route>
						<Route path="/attempt-quiz/:quizCode" component={AttemptQuiz} />
						<Route
							path="/attempt-blind-quiz/:quizCode"
							component={AttemptBlindQuiz}
						/>
						
						<Route component={NotFoundPage} />
					</Switch>
				</>
			)}
		</div>
	);
};

export default App;
