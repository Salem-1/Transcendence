function registration_body() {
	return `
	<img
		id="logo"
		src="/assets/logo1.png"
		alt="yellow 42 Abu dhabi logo"
		onclick="callRoute('/')"
	/>
	<form action="javascript:;" onsubmit="register()">
		<div id="register-div">
			<img id="Person" src="/assets/Person.png" alt="Character" />
			<div class="form-floating mb-3 regPageInput">			
				<input
					type="text"
					class="form-control"
					id="username"
					name="username"
					required
					placeholder="Username"
					data-i18n="username"
					maxlength="12"
				/>
				<label for="username" data-i18n="username"></label>
			</div>
			<div class="form-floating mb-3 regPageInput">
				<input
					type="password"
					class="form-control"
					id="password"
					name="password"
					required
					placeholder="Password"
					data-i18n="password"
					maxlength="35"
				/>
				<label for="password" data-i18n="password"></label>
			</div>
			<div class="form-floating mb-3 regPageInput">
				<input
					type="password"
					class="form-control"
					id="confirmpassword"
					name="confirmpassword"
					required
					placeholder="Confirm password"
					data-i18n="confirmpassword"
					maxlength="35"
				/>
				<label for="confirmpassword" data-i18n="confirm password"></label>
			</div>
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
					<h1 class="button-text" data-i18n="register">REGISTER</h1>
				</div>
			</div>
		</div>
	</form>
				`;
}
