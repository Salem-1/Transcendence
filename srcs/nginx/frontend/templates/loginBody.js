
function loginBody(){
	return (`
	<img id="logo" src="/assets/logo1.png" alt="" onclick="callRoute('/')" />
	<form action="javascript:;" onsubmit="login()">
		<div id="logindiv">
			<img id="Person" src="/assets/Person.png" alt="Character" />
			<input
				type="text"
				id="username"
				name="username"
				required
				placeholder="Username"
				autocomplete="username"
				maxlength="11"
			/>
			<input
				type="password"
				id="password"
				name="password"
				required
				placeholder="Password"
				autocomplete="current-password"
				maxlength="35"
			/>
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
					<h1 class="button-text">LOGIN</h1>
				</div>
			</div>
		</div>
	</form>`);
}
