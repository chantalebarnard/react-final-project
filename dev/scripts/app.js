import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import firebase, { auth, provider } from './firebase.js';

const dbRef = firebase.database().ref('/items');

class Form extends React.Component {
	constructor() {
		super();
		this.state = {
			items: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		if (event.target.name === 'packingItem') {
			this.setState({ packingItem: event.target.value });
		}

		this.setState({
			items: event.target.value,
		})
	}

	handleSubmit(event) {
		event.preventDefault();
		const dbRefItems = firebase.database().ref(`/items/${this.props.eventId}/packingItems`); 
		dbRefItems.push(this.state.items);
		this.setState({
			packingItem: '',
		})
	}

	render() {
		return (
			<section className='addItem'>
				<form onSubmit={this.handleSubmit}>
					<input 
						className="listInput"
						onChange={this.handleChange} 
						name="packingItem"  
						value={this.state.packingItem} 
						type="text" 
						placeholder="What items are you packing?" 
					/>
				</form>
			</section>
		);
	}
}


// make new component and map over packingItems to display them on page
// put component and pass in event id 

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			currentEvent: '',
			events: [],
			user: null,
			showForm: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	login() {
		auth.signInWithPopup(provider)
		.then((result) => {
			this.setState({
				user: result.user,
			});
			dbRef.on('value', (snapshot) => {
				const newItemsArray = [];
				const firebaseItems = snapshot.val();
				for (let key in firebaseItems) {
					const firebaseItem = firebaseItems[key];
					firebaseItem.id = key;
					newItemsArray.push(firebaseItem);
				}
				this.setState({
					events: newItemsArray,
				});
			});
		});
	}

	logout() {
		auth.signOut()
		.then(() => {
			this.setState({
				user: null,
			})
		});
	}

	removeItem(key) {
		const itemRef = firebase.database().ref(`/items/${key}`);
		itemRef.remove();
	}

	handleSubmit(event) {
		event.preventDefault();	
		const newEvent = {
			eventName: this.state.currentEvent,
			user: this.state.user.displayName || this.state.user.email,
		};
		dbRef.push(newEvent);
		this.setState({
			currentEvent: '',
		})
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	componentDidMount() {
		dbRef.on('value', (snapshot) => {
			const newItemsArray = [];
			const firebaseItems = snapshot.val();
			for (let key in firebaseItems) {
				const firebaseItem = firebaseItems[key];
				firebaseItem.id = key;
				newItemsArray.push(firebaseItem);
			}
			this.setState({
				events: newItemsArray,
			});
		});

		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					user: user,
				});
			}
		});
	}

	renderItems(event) {
		const dbRefItems = firebase.database().ref(`/items/${event}/packingItems`);
		dbRefItems.on('value', (snapshot) => {
		})
	 }

	render() {
		return (
			<div className={`${this.state.user ? 'bg2' : 'bg1'} app`}>
				<header>
					<div className='wrapper'>
						<nav>
							{this.state.user ?
							<button onClick={this.logout}>Logout</button>
							:
							<button onClick={this.login}>Log In</button>
						}
						</nav>
						<div className="headerContainer">
							<h1>Trip<span>list</span></h1>
						</div>
					</div>
				</header>
				{this.state.user ?
				<div className='biggestCahuna'>
					<div className='biggerCahuna'>
						<div className='user-profile'>
							<img src={this.state.user.photoURL} />
						</div>
						<div className='bigCahuna'>
							<section className='createEvent'>
								<div className='wrapper'>
									<form onSubmit={this.handleSubmit}>
										<label>What Event are you Packing for?</label>
										<input 
											className='eventInput'
											type="text"
											name="currentEvent"
											placeholder=""
											onChange={this.handleChange}
											value={this.state.currentEvent}
										/>
									</form>
								</div>
							</section>
							<section className='showForm'>
								<div className='wrapper'>
									<div className='container'>
										{this.state.events.map((event) => {
											// console.log(event);
											const packingList = [];
											for (let packingItem in event.packingItems){
												// console.log(packingItem);
												packingList.push(event.packingItems[packingItem])
											}
											return (
												<div className = 'card' key={event.id}>
													<div className='tab'>
														<h2>{event.eventName}</h2>
													</div>
													<Form 
														eventId = {event.id} 
													/>
													{this.renderItems(event.id)} 
												 	<div className="inbox">
												 		{packingList.map(item => {
											 			return(
												 			<div className='listItem'>
												 				<input 
												 					type="checkbox" 
												 				/>
												 				<div className='item'>
												 					{item}
												 				</div>

													 		</div>
												 			)
												 		})}
														<p className='userPost'>
															Posted by: {event.user}
															{event.user === this.state.user.displayName || event.user === this.state.user.email ?
															<button 
																className='removeButton' 
																onClick={() => this.removeItem(event.id)}>Delete List
															</button> : null}
														</p>
													</div>
												</div>
												)
											})}
									</div>
								</div>
							</section>
						</div>
					</div>
				<div className='user-profile'>
					<img src={this.state.user.photoURL} />
				</div>
			</div>
				:
			<div className='loginPage wrapper'>
				<p>Triplist lets people organize their packing list.  Whether its a concert, vacation, destination, planned activities or other personal needs. </p>
			</div>
			}
		</div>
			);
		}
	}

ReactDOM.render(<App />, document.getElementById('app'));


