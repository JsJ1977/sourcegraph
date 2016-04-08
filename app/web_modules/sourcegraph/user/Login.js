import React from "react";
import {Link} from "react-router";

import Container from "sourcegraph/Container";
import Dispatcher from "sourcegraph/Dispatcher";
import {Button, Input} from "sourcegraph/components";

import * as UserActions from "sourcegraph/user/UserActions";
import UserStore from "sourcegraph/user/UserStore";

import "sourcegraph/user/UserBackend"; // for side effects

import CSSModules from "react-css-modules";
import style from "./styles/user.css";

class Login extends Container {
	constructor(props) {
		super(props);
		this._loginInput = null;
		this._passwordInput = null;
		this._handleSubmit = this._handleSubmit.bind(this);
	}

	reconcileState(state, props) {
		Object.assign(state, props);
		state.pendingAuthAction = UserStore.pendingAuthAction;
		state.authResponse = UserStore.authResponse;
	}

	stores() { return [UserStore]; }

	_handleSubmit() {
		Dispatcher.Stores.dispatch(new UserActions.SubmitLogin());
		Dispatcher.Backends.dispatch(new UserActions.SubmitLogin(
				this._loginInput.getValue(),
				this._passwordInput.getValue()
		));
	}

	render() {
		return (
			<div styleName="container">
				<div styleName="title">Hey there, welcome back!</div>
				<div styleName="action">
					<Input type="text"
						autoFocus={true}
						placeholder="Username"
						ref={(c) => this._loginInput = c}
						block={true} />
				</div>
				<div styleName="action">
					<Input type="password"
						placeholder="Password"
						ref={(c) => this._passwordInput = c}
						onSubmit={this._handleSubmit}
						block={true} />
				</div>
				<div styleName="button">
					<Button color="primary"
						block={true}
						loading={this.state.pendingAuthAction || (this.state.authResponse && !this.state.authResponse.Error)}
						onClick={this._handleSubmit}>Sign in</Button>
				</div>
				{!this.state.pendingAuthAction && this.state.authResponse && this.state.authResponse.Error &&
					<div styleName="errtext">Sorry, there's been a problem.<br />{this.state.authResponse.err.message}</div>
				}
				<div styleName="subtext">Oh no, <a href="/forgot">I forgot my password</a></div>
				<div styleName="alt-action">
					<span>Don't have an account yet?</span>
					<span styleName="alt-button"><Link to="/join"><Button size="small" outline={true}>Sign up</Button></Link></span>
				</div>
			</div>
		);
	}
}

export default CSSModules(Login, style);
