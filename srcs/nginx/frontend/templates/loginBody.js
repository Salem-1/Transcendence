function loginBody() {
	return `
		<img id="logo" src="/assets/logo1.png" alt="" onclick="callRoute('/')" />
		<form action="javascript:;" onsubmit="login()">
			<div id="logindiv">
				<img id="Person" src="/assets/Person.png" alt="Character" />
				<div class="form-floating mb-3" id ='test'>
					<input
						type="text"
						class="form-control"
						name="username"
						id="username"
						required
						placeholder="Username"
						data-i18n="username"
						autocomplete="username"
						maxlength="12"
					/>
					<label for="username" data-i18n="username"></label>
				</div>
				<div class="form-floating">
					<input
						type="password"
						class="form-control"
						id="password"
						name="password"
						required
						placeholder="Password"
						data-i18n="password"
						autocomplete="current-password"
						maxlength="35"
					/>
					<label for="password" data-i18n="password"></label>
				</div>
				<input type="submit" hidden />
				<div id="login" onclick="login()">
					<div class="button-div-one" style="background: #c7a940"></div>
					<div
						id="yellow"
						class="button-div-two"
						style="
							background: linear-gradient(
								180deg,
								#eda800 0%,
								#ffbb0b 100%
							);
						"
					></div>
					<div class="button-div-three">
						<h1 class="button-text" data-i18n="login">LOGIN</h1>
					</div>
				</div>
			</div>
		</form>
	`; 
}
