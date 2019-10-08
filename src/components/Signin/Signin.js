import React from 'react';
 


class Signin extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			signInEmail : '',
			signInPassword : ''
		}
	}

	onEmailChange = (event) => {
		this.setState({ signInEmail : event.target.value });
	}

	onPasswordChange = (event) => {
		this.setState({ signInPassword : event.target.value });
	}

	onSignInClick = () => {
		fetch('https://celeface-server.herokuapp.com/signin', {
			method : 'post',
			headers : {'Content-Type' : 'application/json'},
			body : JSON.stringify({
				email : this.state.signInEmail,
				password : this.state.signInPassword
			})
		})
		.then(response => {
			if(response.status === 200){
				return response.json();
			}
			else if(response.status === 401){
				alert("Unable to sign-in. Please check your email and password");
				return null;
			}
			else{ //if the error code is 400
				alert("Oops! Something went wrong. Please try to sign-in again.");
				return null;
				//this.props.onSignedOutRouteChange('signin')
			}
		}).then(userData => {
			if(userData){
				this.props.loadUser(userData);
			}
		}).catch(() => {
			alert("Oops! It seems that you are disconnected. Please check your connection and try to signin again");
		});

	}

	render(){
		const { onSignedOutRouteChange } = this.props;
	return(
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw5 shadow-5 center">	
			<main className="pa4 black-80">
				<div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				    	<legend className="f2 fw6 ph0 mh0">Sign In</legend>
			      		<div className="mt3">
				        	<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        	<input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="email" 
				        	name="email-address"  
				        	id="email-address" 
				        	onChange = {this.onEmailChange}/>
			      		</div>
				        <div className="mv3">
				        	<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        	<input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password" 
				        	onChange = {this.onPasswordChange}/>
				      	</div>
				    </fieldset>
				    <div className="">
				      <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
				       type="submit" 
				       value="Sign in"
				       onClick = {this.onSignInClick} />
				    </div>
				    <div className="lh-copy mt3 pointer">
				      <p onClick = {() => onSignedOutRouteChange('register')}
				      className="f6 link dim black db">New here?, try Registering!</p>
				    </div>
				</div>
			</main>
		</article>
		);	
	}
}

export default Signin;