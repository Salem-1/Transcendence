require("dotenv").config();
const { Builder, By, Key, until } = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");

const resetColor = "\x1b[0m";
const redColor = "\x1b[31m";
const greenColor = "\x1b[32m";
const yellowColor = "\x1b[33m";

async function runTest(testtype) {
	if (testtype == undefined || testtype == ".") testtype = "all";
	try {
		let user = process.env.TEST_USERNAME; //"tournmentking";
		let pass = process.env.TEST_PASSWORD; //"A12345678qwertyui";
		if (
			testtype == "reg" ||
			testtype == "all" ||
			testtype == "register" ||
			testtype == 1
		) {
			await registerTestCases(user);
		}
		if (testtype == "login" || testtype == "all" || testtype == 2) {
			await lgoinTestCases(user);
		}
		if (
			testtype == "tor" ||
			testtype == "tournament" ||
			testtype == "all" ||
			testtype == 3
		) {
			// tournamentTestCases(user);
			// tournamentInputTestCases(user);
		}
		if (testtype == "access" || testtype == "all" || testtype == 4) {
			await testHomePageAccess(user, pass, "Login Failed, Invalid username or password", 20);
		}
		if (testtype == "intra" || testtype == "all" || testtype == 5)
			await testIntraAuth("hello", 11);
	} catch (e) {
		console.log(e);
	}
}

runTest(process.argv[2]);

async function registerTestCases(user) {
	await testRegister(
		generateRandomText(8),
		"3322122233",
		"3322122233",
		"Registration failed: Password should contain at least one uppercase letter, one lowercase letter and, one number",
		1
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		"user",
		"A12345678qwertyui",
		"A12345678qwertyui",
		"Registration failed: Username already taken",
		2
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		"usedfgdfsgdsr",
		"",
		"3322122233",
		"Registration failed: Password should be at least 8 characters long and not more than 35 characters",
		3
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		generateRandomText(8),
		"3333",
		"3333",
		"Registration failed: Password should be at least 8 characters long and not more than 35 characters",
		4
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		generateRandomText(8),
		"",
		"",
		"Registration failed: Password should be at least 8 characters long and not more than 35 characters",
		5
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		generateRandomText(8),
		"aA0sdfasdfdsafasdfasd",
		"000Aa00000000",
		"Registration failed: Passwords do not match",
		6
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		"",
		"3322122233",
		"3322122233",
		"Registration failed: Username should be at least 3 characters long and not more than 20 characters",
		7
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		"users'-4-$'-",
		"3cC322122233",
		"3cC322122233",
		"Registration failed: Username should contain only letters, numbers and underscores",
		13
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		generateRandomText(8),
		"33221222Aa33",
		"33221222Aa33",
		"Registration success",
		15
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		"users@@",
		"33221Aa22233",
		"33221Aa22233",
		"Registration failed: Username should contain only letters, numbers and underscores",
		16
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		generateRandomText(8),
		process.env.TEST_PASSWORD,
		process.env.TEST_PASSWORD,
		"Registration success",
		14
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testRegister(
		user,
		process.env.TEST_PASSWORD,
		process.env.TEST_PASSWORD,
		"Registration failed: Username already taken",
		17
	);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
}

async function lgoinTestCases(user) {
	await testLogin("user2", "", "Login Failed, Invalid username or password", 9);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testLogin("", "3322122233", "Login Failed, Invalid username or password", 10);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
	await testLogin("user'---", "3cC322122233", "Login Failed, Invalid username or password", 12);
	// await (new Promise(resolve => setTimeout(resolve, 3000)));
}

async function tournamentTestCases(user) {
	// testTournament([""], user, process.env.TEST_PASSWORD,"Cannot launch tournament without players", 18);
	// testTournament(["ahmed"], user, process.env.TEST_PASSWORD,"You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 19);
	let arr = ["6", "7", "1", "2", "3", "4", "5", "8"];
	let counter = 0;
	i = arr.length;
	testTournament(
		arr,
		user,
		process.env.TEST_PASSWORD,
		"starting tournament",
		18 + counter
	);
	// while (i > 0) {
	// 	i = arr.length;
	//     if (i > 1){
	//         testTournament(arr, user, process.env.TEST_PASSWORD,"starting tournament", 18 + counter);
	//         await (new Promise(resolve => setTimeout(resolve, 3000)));
	//     }
	//     else if (i == 1){
	//         await (new Promise(resolve => setTimeout(resolve, 3000)));
	//         testTournament(arr, user, process.env.TEST_PASSWORD,"You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 18 + counter);
	//         await (new Promise(resolve => setTimeout(resolve, 3000)));
	//     }
	//     else{
	//         await (new Promise(resolve => setTimeout(resolve, 3000)));
	//         testTournament(arr, user, process.env.TEST_PASSWORD,"Cannot launch tournament without players", 18 + counter);
	//     }
	//     arr.pop();
	//     counter++;
	// }
}
async function testIntraAuth(message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await driver.get("http://127.0.0.1:3000");
		//find the intraauth link and click it here , id login42

		const login42Link = await driver.wait(
			until.elementLocated(By.id("login42")),
			5000
		);
		await driver.executeScript("arguments[0].click();", login42Link);
		await new Promise((resolve) => setTimeout(resolve, 3000));
		while (1) {
			url = await driver.getCurrentUrl();
			if (url.includes(":3000") && !url.includes(":3000/auth")) break;
			await driver.sleep(300);
		}
		url = await driver.getCurrentUrl();
		if (url.includes("/home"))
			console.log(
				greenColor + order,
				" 😁 Test passed  url Text:",
				url + resetColor
			);
		else {
			console.log("👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇");
			console.log(
				redColor + order,
				" 😱 Test  failed url Text: expected /home path 😬😬😬 got ➡️>",
				url + resetColor
			);
			console.log("👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆");
		}
	} finally {
		await driver.quit();
	}
}
async function testRegister(username, pass, repass, message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await driver.get("http://127.0.0.1:3000/register");
		await new Promise((resolve) => setTimeout(resolve, 300));

		await driver.findElement(By.id("username")).sendKeys(username);
		await driver.findElement(By.id("password")).sendKeys(pass);
		await driver.findElement(By.id("confirmpassword")).sendKeys(repass);
		const innerDiv = await driver.wait(
			until.elementLocated(
				By.css("#registration-button > div:last-child")
			),
			5000
		);
		await innerDiv.click();

		await new Promise((resolve) => setTimeout(resolve, 300));

		await driver.wait(until.alertIsPresent());
		let alert = await driver.switchTo().alert();
		let alertText = await alert.getText();
		if (alertText === message)
			console.log(
				greenColor + order,
				" 😁 Test passed  Alert Text:",
				alertText + resetColor
			);
		else {
			console.log("===================👇==================");
			console.log(
				redColor + order,
				" 😱 Test  failed Alert Text: expected",
				message,
				"😬😬😬 got ➡️>",
				alertText + resetColor
			);
			console.log("-------------------👆------------------");
		}
	} finally {
		await driver.quit();
	}
}

async function testLogin(username, pass, message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await driver.get("http://127.0.0.1:3000/login");
		await new Promise((resolve) => setTimeout(resolve, 300));

		await driver.findElement(By.id("username")).sendKeys(username);
		await driver.findElement(By.id("password")).sendKeys(pass);

		const registrationButton = await driver.wait(
			until.elementLocated(By.id("login")),
			5000
		);
		const innerDiv = await driver.wait(
			until.elementLocated(By.css("#login > div:last-child")),
			5000
		);
		await innerDiv.click();
		await new Promise((resolve) => setTimeout(resolve, 300));

		await driver.wait(until.alertIsPresent());
		let alert = await driver.switchTo().alert();
		let alertText = await alert.getText();
		if (alertText === message)
			console.log(
				greenColor + order,
				" 😁 Test passed  Alert Text:",
				alertText + resetColor
			);
		else {
			console.log("👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇");
			console.log(
				redColor + order,
				" 😱 Test  failed Alert Text: expected",
				message,
				"😬😬😬 got ➡️>",
				alertText + resetColor
			);
			console.log("👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆");
		}
	} finally {
		await driver.quit();
	}
}

function generateRandomText(length) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomText = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomText += characters.charAt(randomIndex);
	}

	return randomText;
}

async function login(driver, username, pass) {
	await driver.get("http://127.0.0.1:3000/login");
	await new Promise((resolve) => setTimeout(resolve, 700));
	await driver.get("http://127.0.0.1:3000/login");
	await new Promise((resolve) => setTimeout(resolve, 700));

	await driver.findElement(By.id("username")).sendKeys(username);
	await driver.findElement(By.id("password")).sendKeys(pass);

	const registrationButton = await driver.wait(
		until.elementLocated(By.id("login")),
		5000
	);
	const innerDiv = await driver.wait(
		until.elementLocated(By.css("#login > div:last-child")),
		5000
	);
	await innerDiv.click();

	await driver.wait(until.alertIsPresent());
	let alert = await driver.switchTo().alert();
	await alert.accept();
}

async function clickStartButton(driver) {
	const startButtonLocator = By.id("start_tournament");
	try {
		await driver.wait(until.elementLocated(startButtonLocator), 5000);
		const startButton = await driver.findElement(startButtonLocator);
		await startButton.click();
	} catch (error) {
		console.error("Error finding or clicking the start button:", error);
	}
}

async function testTournament(players, username, pass, message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await login(driver, username, pass);
		await new Promise((resolve) => setTimeout(resolve, 3000));
		await dismissAlert(driver);
		// await clickStartButton(driver);

		// await driver.get('http://127.0.0.1:3000/register_players');
		// await (new Promise(resolve => setTimeout(resolve, 700)));

		// for (let i = 0; i < players.length; i++){
		//     await driver.findElement(By.id('player-name')).sendKeys(players[i]);
		//     innerDiv = await driver.wait(until.elementLocated(By.id('add-player')), 5000);
		//     await innerDiv.click();
		// }
		// for (let i = 0; i < players.length; i++){
		//     await driver.findElement(By.id('player-name')).sendKeys(players[i]);
		//     innerDiv = await driver.wait(until.elementLocated(By.id('add-player')), 5000);
		//     await innerDiv.click();
		// }

		// const launch = await driver.wait(until.elementLocated(By.id('launch-tournamet')), 5000);
		// await launch.click();
		// const launch = await driver.wait(until.elementLocated(By.id('launch-tournamet')), 5000);
		// await launch.click();

		// await driver.wait(until.alertIsPresent());
		// await driver.wait(until.alertIsPresent());

		// let tournament_alert = await driver.switchTo().alert();
		// let tournament_alertText = await tournament_alert.getText();
		// let tournament_alert = await driver.switchTo().alert();
		// let tournament_alertText = await tournament_alert.getText();

		// if (tournament_alertText === message)
		//     console.log(greenColor + order, ' 😁 Test passed  Alert Text:', tournament_alertText + resetColor);
		// else {
		//     console.log('👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇');
		//     console.log(redColor + order, ' 😱 Test failed Alert Text: expected', message, '😬😬😬 got ➡️>', tournament_alertText + resetColor);
		//     console.log('👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆');
		// }
	} finally {
		// await driver.quit();
	}
}

async function testInputTournament(players, username, pass, message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		await login(driver, username, pass);
		await dismissAlert(driver);
		await clickStartButton(driver);

		let addPlayer;
		let tournament_alert;
		let tournament_alertText;
		for (let i = 0; i < players.length; i++) {
			await driver.findElement(By.id("player-name")).sendKeys(players[i]);
			innerDiv = await driver.wait(
				until.elementLocated(By.id("add-player")),
				5000
			);
			await innerDiv.click();
			if (i == 1) {
				await driver.wait(until.alertIsPresent());
				tournament_alert = await driver.switchTo().alert();
				tournament_alertText = await tournament_alert.getText();
			}
		}
		if (players.length == 1) {
			await driver.wait(until.alertIsPresent());
			tournament_alert = await driver.switchTo().alert();
			tournament_alertText = await tournament_alert.getText();
		}

		if (tournament_alertText === message)
			console.log(
				greenColor + order,
				" 😁 Test passed  Alert Text:",
				tournament_alertText + resetColor
			);
		else {
			console.log("👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇");
			console.log(
				redColor + order,
				" 😱 Test failed Alert Text: expected",
				message,
				"😬😬😬 got ➡️>",
				tournament_alertText + resetColor
			);
			console.log("👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆");
		}
	} finally {
		await driver.quit();
	}
}
async function tournamentInputTestCases(user) {
	// testTournament([""], user, process.env.TEST_PASSWORD,"Cannot launch tournament without players", 18);
	// testTournament(["ahmed"], user, process.env.TEST_PASSWORD,"You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 19);
	let arr = ["6", "6"];
	testInputTournament(
		arr,
		user,
		process.env.TEST_PASSWORD,
		"Player already added",
		27
	);
	await new Promise((resolve) => setTimeout(resolve, 3000));
	arr = ["     "];
	testInputTournament(
		arr,
		user,
		process.env.TEST_PASSWORD,
		"Please enter a valid player name.",
		27
	);
	arr = ["     \n"];
	testInputTournament(
		arr,
		user,
		process.env.TEST_PASSWORD,
		"Please enter a valid player name.",
		27
	);
	arr = ["     \t"];
	testInputTournament(
		arr,
		user,
		process.env.TEST_PASSWORD,
		"Please enter a valid player name.",
		27
	);
	await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function testAccess(driver, target_subdomain, expected_url, order) {
	await driver.get(target_subdomain);
	let url = await driver.getCurrentUrl();
	if (url === expected_url)
		console.log(
			greenColor + order,
			" 😁 Test passed page",
			url + resetColor
		);
	else
		console.log(
			redColor + order,
			" 😱 Test failed Accessing page",
			url + resetColor
		);
}

async function testHomePageAccess(username, pass, message, order) {
	let driver = await new Builder().forBrowser("chrome").build();
	try {
		testAccess(
			driver,
			"http://127.0.0.1:3000/home",
			"http://127.0.0.1:3000/login",
			1
		);
		await login(driver, username, pass);
		let allCookies = await driver.manage().getCookies();
		let cookies = allCookies
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ");

		// Make an HTTP request with the cookies
		// url = 'http://127.0.0.1:3000/home'
		// console.log(url);
		// let response = await axios.get(url, {
		// 	headers: {
		// 		Cookie: cookies,
		// 	},
		// });
		// await driver.get("http://127.0.0.1:3000/login");
		// url = await driver.getCurrentUrl();
		// if (
		// 	url === "http://127.0.0.1:3000/home" ||
		// 	url === "http://127.0.0.1:3000/home"
		// )
		// 	console.log(
		// 		greenColor + order,
		// 		" 😁 Test passed  Accessing home page",
		// 		url + resetColor
		// 	);
		// else
		// 	console.log(
		// 		redColor + order,
		// 		" 😱 Test failed Accessing home page",
		// 		url + resetColor
		// 	);
	} finally {
		await driver.quit();
	}
}

/*
  https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d3951b4aa9c63bfcc57b80e22872c5b27607beb50bb6f5eb315114be173f0b83
  &redirect_uri=http://127.0.0.1:3000/api/auth/callback/42-school
  &response_type=code
  &scope=public
  &state=a_very_long_random_string_witchmust_be_unguessable'

ogin-and-registeration
  */
