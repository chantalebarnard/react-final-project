import React from 'react';
import firebase, { auth, provider } from './firebase.js';
const Header = () => {
	return (
		<header>
			<div className='wrapper'>
				<h1>Fun Food Friends</h1>
					{this.state.user ?
					<button onClick={this.logout}>Logout</button>
					:
					<button onClick={this.login}>Log In</button>
				}
			</div>
		</header>
	)
}
export default Header;

// {this.state.user ?
// <button onClick={this.logout}>Logout</button>
// :
// <button onClick={this.login}>Log In</button>