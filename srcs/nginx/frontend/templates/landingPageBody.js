function landingPageBody()
{
	return (`
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
					<h1 class="button-text">LOGIN</h1>
				</div>
			</div>
	
			<a
				href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e3d56b28d94563203a40bdd0c97c550a7a7c6cc6529e13b93bf47f4451dcbca3&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code"
			>
				<div id="login42">
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
						<h1 class="button-text">LOGIN 42</h1>
					</div>
				</div>
			</a>
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
					<h1 class="button-text">REGISTER</h1>
				</div>
			</div>
			<div class="quote">
				<h1 id="quote-text">
					Quote: When someone says “Expect the Unexpected” slap them and say :
					“You didn't expect that, did you?”
				</h1>
			</div>
		</div>`)
}
