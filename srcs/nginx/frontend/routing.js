const urlPageTitle = "Pong Game";
const defaulttheme = "/css/style.css";

// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		template: error_404(),
		title: "404 | " + urlPageTitle,
		description: "Page not found",
	},
	"/": {
		template: landingPageBody(),
		title: "Home | " + urlPageTitle,
		description: "This is the home page",
	},
	"/login": {
		template: loginBody(),
		title: "Login | " + urlPageTitle,
		description: "This is the login page",
		theme: "/css/login.css",
		loggedIn: true,
	},
	"/register": {
		template: registration_body(),
		title: "Registration | " + urlPageTitle,
		description: "This is the registration page",
		theme: "/css/registration.css",
	},
	"/home": {
		template: homePageBody(),
		title: "Home | " + urlPageTitle,
		description: "This is the Home page",
		script: ["greet.js", "tournament.js"],
		requiresAuth: true,
	},
	"/game": {
		template: gamePageBody(),
		title: "Game | " + urlPageTitle,
		description: "This is the Game page",
		script: ["game.js"],
		// loggedIn: true,
	},
	"/auth": {
		template: auth(),
		title: "auth | " + urlPageTitle,
		description: "This is the authentacation page",
		script: ["auth.js"],
	},
	"/register_players": {
		template: registerPlayers(),
		title: "register_players | " + urlPageTitle,
		description: "This is the registeration page for the tournament",
		theme: "/css/tournament.css",
		script: ["tournament.js"],
		// loggedIn: true,
	},
	"/tournament": {
		template: tournamentBody(),
		title: "tournament | " + urlPageTitle,
		description: "This is the tournament page",
		theme: "/css/tournament_styles.css",
		script: ["tournament_algorithm.js"],
	},
};

async function callRoute(route) {
	window.history.pushState({}, "", route);
	urlLocationHandler();
}

// create a function that watches the url and calls the urlLocationHandler
const route = (event) => {
	event = event || window.event; // get window.event if event argument not provided
	event.preventDefault();
	// window.history.pushState(state, unused, target link);
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

const isVerified = async () => {
	const response = await fetch(
		"http://localhost:8000/api/loginVerfication/",
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

// create a function that handles the url location
const urlLocationHandler = async () => {
	const location = window.location.pathname; // get the url path
	// if the path length is 0, set it to primary page route
	if ((location.length = 0)) {
		location = "/";
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[location] || urlRoutes["404"];
	if (route.requiresAuth && !(await isVerified())){
		callRoute("/login");
		return;
	}
	if (route.loggedIn && (await isVerified())){
		callRoute("/home");
		return;
	}

	// get the html from the template
	const html = route.template;
	// set the content of the content div to the html
	document.getElementById("content").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);
	if (route.theme)
		theme.setAttribute("href", route.theme);
	else
		theme.setAttribute("href", defaulttheme);
	// for (let i = 0; i < document.script.length; i++) {
	// 	console.log(document.script[i]);
	// 	document.script[i].remove();
	// }
	// const script = document.createElement("script");
	// script.src = route.script;
	// document.body.appendChild(script);
	if (route.script) {
		for (let i = 0; i < route.script.length; i++) {
			const script = document.createElement("script");
			script.src = route.script[i];
			document.body.appendChild(script);
		}
		// script.src = route.script;
		// document.body.appendChild(script);
	}
};

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler;
// call the urlLocationHandler function to handle the initial url
window.route = route;
// call the urlLocationHandler function to handle the initial url
urlLocationHandler();

