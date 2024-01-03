const urlPageTitle = "Pong Game";

// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		template: "/404.html",
		title: "404 | " + urlPageTitle,
		description: "Page not found",
	},
	"/": {
		template: "/templates/landing-page-body.html",
		title: "Home | " + urlPageTitle,
		description: "This is the home page",
		theme: "/css/style.css",
	},
	"/frontend/": {
		template: "/templates/landing-page-body.html",
		title: "Home | " + urlPageTitle,
		description: "This is the home page",
		theme: "/css/style.css",
	},
	"/login": {
		template: "/templates/login-body.html",
		title: "Login | " + urlPageTitle,
		description: "This is the login page",
		theme: "/css/login.css",
	},
	"/register": {
		template: "/templates/registration-body.html",
		title: "Registration | " + urlPageTitle,
		description: "This is the registration page",
		theme: "/css/registration.css",
	},
	"/home": {
		template: "/templates/home-page-body.html",
		title: "Home | " + urlPageTitle,
		description: "This is the Home page",
		theme: "/css/style.css",
		script: "greet.js",
		requiresAuth: true,
	},
	"/game": {
		template: "/templates/game-page-body.html",
		title: "Game | " + urlPageTitle,
		description: "This is the Game page",
		theme: "/css/style.css",
		script: "game.js",
	},
	"/auth": {
		template: "/templates/auth.html",
		title: "auth | " + urlPageTitle,
		description: "This is the authentacation page",
		theme: "/css/style.css",
		script: "auth.js",
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
	callRoute("/login");
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
	if (route.requiresAuth && !(await isVerified())) return;

	// get the html from the template
	const html = await fetch(route.template).then((response) =>
		response.text()
	);
	// set the content of the content div to the html
	document.getElementById("content").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);
	theme.setAttribute("href", route.theme);
	if (route.script) {
		const script = document.createElement("script");
		script.src = route.script;
		document.body.appendChild(script);
	}
};

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler;
// call the urlLocationHandler function to handle the initial url
window.route = route;
// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
