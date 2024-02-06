function landingPageBody() {
	return `
		<ul
			class="nav flex-column fixed-top"
			style="float: left; cursor: pointer;"
		>
			<li class="nav-item">
				<a style="color: aliceblue" onclick="changeLanguage('en')">
					<img
						src="assets/gb.svg"
						alt="English"
						width="30"
						height="24"
					/>
					English
				</a>
			</li>
			<li class="nav-item">
				<a style="color: aliceblue" onclick="changeLanguage('es')">
					<img
						src="assets/es.svg"
						alt="Español"
						width="30"
						height="24"
					/>
					Español
				</a>
			</li>
			<li class="nav-item">
				<a style="color: aliceblue" onclick="changeLanguage('pt')">
					<img
						src="assets/pt.svg"
						alt="Português"
						width="30"
						height="24"
					/>
					Português
				</a>
			</li>
			<li class="nav-item">
				<a style="color: aliceblue" onclick="changeLanguage('ar')">
					<img
						src="assets/eg.svg"
						alt="العربية"
						width="30"
						height="24"
					/>
					العربية
				</a>
			</li>
		</ul>
 		<div class="btns">
			<img
				id="logo"
				src="/assets/logo1.png"
				alt="yellow logo of 42 abu dhabi"
				onclick="callRoute('/')"
			/>
			<div id="login" onclick="callRoute('/login')">
				<div class="button-div-one" style="background: #f01e1e"></div>
				<div
					id="red"
					class="button-div-two"
					style="
						background: linear-gradient(180deg, #ff2c17 0%, #ff5353 100%);
					"
				></div>
				<div class="button-div-three">
					<h1 class="button-text" data-i18n="login" >LOGIN</h1>
				</div>
			</div>
	
		
				<div id="login42" onclick="oauthRedirect()">
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
						<h1 class="button-text" data-i18n="login 42">LOGIN 42</h1>
					</div>
				</div>
		
			<div id="register" onclick="callRoute('/register')">
				<div class="button-div-one" style="background: #82764d"></div>
				<div
					id="black"
					class="button-div-two"
					style="
						background: linear-gradient(180deg, #524040 0%, #070706 100%);
					"
				></div>
				<div class="button-div-three">
					<h1 class="button-text" data-i18n="register" > REGISTER</h1>
				</div>
			</div>
			<div class="quote">
				<h1 id="quote-text" data-i18n="quote">
					When someone says “Expect the Unexpected” slap them and say :
					“You didn't expect that, did you?”
				</h1>
			</div>
		</div>`;
}
