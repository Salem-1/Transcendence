
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
			/>
			<input
				type="password"
				id="password"
				name="password"
				required
				placeholder="Password"
				autocomplete="current-password"
			/>
			<input type="submit" hidden />
			<div id="login" onclick="login()">
				<div class="button-div-one" style="background: #f01e1e"></div>
				<div
					id="red"
					class="button-div-two"
					style="
						background: linear-gradient(
							180deg,
							#ff2c17 0%,
							#ff5353 100%
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
