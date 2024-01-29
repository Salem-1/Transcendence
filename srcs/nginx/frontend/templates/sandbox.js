function sandbox() {
	return `
 		<div class="btns">
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
					<h1 class="button-text" data-i18n="login" ></h1>
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
					<h1 class="button-text" data-i18n="login" ></h1>
				</div>
			</div>
			<div class="quote">
				<h1 id="quote-text">
					Quote: When someone says “Expect the Unexpected” slap them and say :
					“You didn't expect that, did you?”
				</h1>
			</div>
		</div>`;
}
