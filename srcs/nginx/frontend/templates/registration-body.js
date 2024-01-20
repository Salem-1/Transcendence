
function registration_body(){

	return (`
	<img
		id="logo"
		src="/assets/logo1.png"
		alt="yellow 42 Abu dhabi logo"
		onclick="callRoute('/')"
	/>
	<form action="javascript:;" onsubmit="register()">
		<div id="register-div">
			<img id="Person" src="/assets/Person.png" alt="Character" />
			<input
				type="text"
				id="username"
				name="username"
				required
				placeholder="Username"
				maxlength="20"
			/>
			<input
				type="password"
				id="password"
				name="password"
				required
				placeholder="Password"
				maxlength="35"
			/>
			<input
				type="password"
				id="confirmpassword"
				name="confirmPassword"
				required
				placeholder="Confirm Password"
				maxlength="35"
			/>
			<input type="submit" hidden />
			<div
				id="registration-button"
				onclick="register()"
				style="cursor: pointer"
			>
				<div class="button-div-one" style="background: #82764d"></div>
				<div
					id="black"
					class="button-div-two"
					style="
						background: linear-gradient(
							180deg,
							#524040 0%,
							#070706 100%
						);
					"
				></div>
				<div class="button-div-three">
					<h1 class="button-text">REGISTER</h1>
				</div>
			</div>
		</div>
	</form>
				`);
	}