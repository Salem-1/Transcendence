const urlPageTitle = "Pong Game";
const defaulttheme = "/css/style.css";
// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		template: error_template("404 NOT FOUND", "Uh-oh! Looks like you're lost in the game. <br> Level not found! Try a different path."),
		title: "404 | " + urlPageTitle,
		description: "Page not found",
		theme: "/css/error.css",
	},
	"/": {
		template: landingPageBody(),
		title: "Home | " + urlPageTitle,
		description: "This is the home page",
		theme: "/css/style.css",
		IntroPages: true,
	},
	"/login": {
		template: loginBody(),
		title: "Login | " + urlPageTitle,
		description: "This is the login page",
		theme: "/css/login.css",
		IntroPages: true,
	},
	"/register": {
		template: registration_body(),
		title: "Registration | " + urlPageTitle,
		description: "This is the registration page",
		theme: "/css/registration.css",
		IntroPages: true,
	},
	"/home": {
		template: homePageBody(),
		title: "Home | " + urlPageTitle,
		description: "This is the Home page",
		theme: "/css/homePage.css",
		script: [
			"/javascript/greet.js",
			"/javascript/tournament.js",
			"/javascript/dropDown.js",
		],
		requiresAuth: true,
	},
	"/game": {
		template: gamePageBody(),
		title: "Game | " + urlPageTitle,
		description: "This is the Game page",
		theme: "/css/game.css",
		script: ["/javascript/game.js"],
		requiresAuth: true,
	},
	"/AIgame": {
		template: gamePageBody(),
		title: "Game | " + urlPageTitle,
		description: "This is the Game page",
		theme: "/css/game.css",
		script: ["/javascript/Aigame.js"],
		requiresAuth: true,
	},
	"/auth": {
		template: auth(),
		title: "auth | " + urlPageTitle,
		description: "This is the authentacation page",
		theme: "/css/auth.css",
		script: ["/javascript/auth.js"],
	},
	"/tournament": {
		template: tournamentBody(),
		title: "tournament | " + urlPageTitle,
		description: "This is the tournament page",
		theme: "/css/tournament_styles.css",
		script: ["/javascript/tournament_algorithm.js", "/javascript/dropDown.js", "/javascript/greet.js"],
		requiresAuth: true,
	},
	"/settings": {
		template: settingsBody(),
		title: "Settings | " + urlPageTitle,
		description: "This is the Settings page",
		script: ["/javascript/dropDown.js", "/javascript/2FA.js", "/javascript/greet.js"],
		theme: "/css/settings.css",
		requiresAuth: true,
	},
	"/sandbox": {
		template: sandbox(),
		title: "sandbox | " + urlPageTitle,
		description: "This is the sandbox page",
		theme: "/css/style.css",
		// script: ["/javascript/sandbox.js"],
	},
};

async function callRoute(path) {
	if (!path.startsWith("/"))
	{
		console.error("Path must start with /");
		return
	}
	url = window.location.origin + path;
	window.history.pushState({}, "", url);
	await urlLocationHandler();
}
// create a function that watches the url and calls the urlLocationHandler
const route = (event) => {
	event = event || window.event; // get window.event if event argument not provided
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
	const location = window.location.pathname; // get the url path
	// if the path length is 0, set it to primary page route
	if ((location.length = 0)) {
		location = "/";
	}
	// get the route object from the urlRoutes object
	const route = await urlRoutes[location] || urlRoutes["404"];
	if (route.requiresAuth && !(await isVerified())) {
		fetch(`https://localhost:443${location}`, {
			headers: { "X-Trans42-code": "401" },
			method: "GET",
		});
		await callRoute("/login");
		return;
	} else if (route.IntroPages && (await isLoggedIn())) {
		await callRoute("/home");
		return;
	}
	if (route == urlRoutes[404]) {
		await fetch(`https://localhost:443${location}`, {
			headers: { "X-Trans42-code": "404" },
			method: "GET",
		});
	}
	// get the html from the template
	const html = route.template;
	// set the content of the content div to the html
	document.getElementById("content").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	if (route.theme) theme.setAttribute("href", route.theme);
	else theme.setAttribute("href", defaulttheme);
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);
	if (route.script) {
		for (let i = 0; i < route.script.length; i++) {
			const script = document.createElement("script");
			script.src = route.script[i];
			document.body.appendChild(script);
		}
	}
	const userPreferredLanguage = localStorage.getItem("language") || "en";
	const langData = await fetchLanguageData(userPreferredLanguage);
	updateContent(langData);
};

async function isLoggedIn() {
	return !(await isNotLoggedIn());
}

const isVerified = async () => {
	const response = await fetch(
		"https://localhost:443/api/loginVerfication/",
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Add this line
		}
	);
	if (response.ok) {
		return true;
	}
	return false;
};

const isNotLoggedIn = async () => {
	try{
		const response = await fetch("https://localhost:443/api/notLoggedIn/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Add this line
		});
		if (response.ok) {
			return true;
		}
		return false;
	}
	catch (e){
		return (false);
	}
};

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler;
// call the urlLocationHandler function to handle the initial url
window.route = route;
// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
