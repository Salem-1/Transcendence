const { Builder, By, Key, until } = require('selenium-webdriver');

const resetColor = '\x1b[0m';
const redColor = '\x1b[31m';
const greenColor = '\x1b[32m';
const yellowColor = '\x1b[33m';

async function runTest(testtype) {
	if (testtype == undefined || testtype == ".")
		testtype = "all";
    try{
        let user = "tournmentking";
		if (testtype == "reg" || testtype == "all" || testtype == "register" || testtype == 1)
		{
			registerTestCases(user);
        	await (new Promise(resolve => setTimeout(resolve, 3000)));
		}
		if (testtype == "login" || testtype == "all" || testtype == 2)
        {
			lgoinTestCases(user);
        	await (new Promise(resolve => setTimeout(resolve, 3000)));
		}
		if (testtype == "tor" || testtype == "tournament" || testtype == "all" || testtype == 3)
		{
			tournamentTestCases(user);
        	tournamentInputTestCases(user);
		}
		if (testtype == "intraauth" || testtype == "all")
        	testIntraAuth("hello", 11);
        
    }
    catch (e)
    {
        console.log(e);
    }
}

runTest(process.argv[2]);

async function registerTestCases(user){
    testRegister(generateRandomText(8), "3322122233", "3322122233" ,"Registration failed: password must contain at least one upper, lower case letters and number", 1);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister("user", "A12345678qwertyui", "A12345678qwertyui" ,"Registration failed: Username already taken", 2);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister("usedfgdfsgdsr", "", "3322122233" ,"Passwords too short, should be 8 cahr at leaset", 3);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(generateRandomText(8), "3333", "3333" ,"Passwords too short, should be 8 cahr at leaset", 4);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(generateRandomText(8), "", "" ,"Passwords too short, should be 8 cahr at leaset", 5);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(generateRandomText(8), "aA0sdfasdfdsafasdfasd", "000Aa00000000" ,"Registration failed: Passwords do not match", 6);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister("", "3322122233", "3322122233" ,"Registration failed: Choose longer username", 7);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister("users'-4-$'-", "3cC322122233", "3cC322122233" ,"Registration failed: Username cannot contain  those characters !@#$%^&*,.?\":;{} ' ' |<>'", 13);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(generateRandomText(8), "33221222Aa33", "33221222Aa33" ,"Registration successful! Now you can log in.", 15);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister("users@@", "33221Aa22233","33221Aa22233", "Registration failed: Username cannot contain  those characters !@#$%^&*,.?\":;{} ' ' |<>'" , 16);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(generateRandomText(8), "3Aa322122233", "3Aa322122233" ,"Registration successful! Now you can log in.", 14);
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    testRegister(user, "3Aa322122233", "3Aa322122233" ,"Registration failed: Username already taken", 17);    
    await (new Promise(resolve => setTimeout(resolve, 1000)));
}

async function lgoinTestCases(user){
    testLogin("user2", "","Invalid username", 9);
    testLogin("", "3322122233","Invalid username", 10);
    testLogin("user'---", "3cC322122233","Invalid username", 12);
}

async function tournamentTestCases(user){
    // testTournament([""], user, "3Aa322122233","Cannot launch tournament without players", 18);
    // testTournament(["ahmed"], user, "3Aa322122233","You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 19);
    let arr = ["6", "7", "1", "2", "3", "4", "5", "8"];
    let counter = 0;
	i = arr.length;
    while (i > 0) {
		i = arr.length;
        if (i > 1){
            testTournament(arr, user, "3Aa322122233","starting tournament", 18 + counter);
            await (new Promise(resolve => setTimeout(resolve, 3000)));
        }
        else if (i == 1){
            await (new Promise(resolve => setTimeout(resolve, 3000)));
            testTournament(arr, user, "3Aa322122233","You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 18 + counter);
            await (new Promise(resolve => setTimeout(resolve, 3000)));
        }
        else{
            await (new Promise(resolve => setTimeout(resolve, 3000)));
            testTournament(arr, user, "3Aa322122233","Cannot launch tournament without players", 18 + counter);
        }
        arr.pop();
        counter++;
    }
}
async function testIntraAuth(message, order){
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000');
      //find the intraauth link and click it here , id login42
      const login42Link = await driver.findElement(By.linkText('LOGIN 42'));
      await driver.executeScript("arguments[0].click();", login42Link);


        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
        else
            {
                console.log('👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇');
                console.log(redColor + order,  ' 😱 Test  failed Alert Text: expected', message, '😬😬😬 got ➡️>', alertText + resetColor);
                console.log('👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆');
            }
        }
    finally {
        await driver.quit();
    }
}
async function testRegister(username, pass, repass, message, order)
{
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://localhost:3000/register');
        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(pass);
        await driver.findElement(By.id('confirmpassword')).sendKeys(repass);
        const registrationButton = await driver.wait(until.elementLocated(By.id('registration-button')), 5000);
        const innerDiv = await driver.wait(until.elementLocated(By.css('#registration-button > div:last-child')), 5000);
        await innerDiv.click();

        
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
        else
            {
                console.log('===================👇==================');
                console.log(redColor + order,  ' 😱 Test  failed Alert Text: expected', message, '😬😬😬 got ➡️>', alertText + resetColor);
                console.log('-------------------👆------------------');
            }    
        }
    finally {
        await driver.quit();
    }
}

async function testLogin(username, pass, message, order){

    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000/login');
        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(pass);
        
        const registrationButton = await driver.wait(until.elementLocated(By.id('login')), 5000);
        const innerDiv = await driver.wait(until.elementLocated(By.css('#login > div:last-child')), 5000);
        await innerDiv.click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
            else
            {
                console.log('👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇');
                console.log(redColor + order,  ' 😱 Test  failed Alert Text: expected', message, '😬😬😬 got ➡️>', alertText + resetColor);
                console.log('👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆');
            } 
    }
    finally {
        await driver.quit();
    }
}




function generateRandomText(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomText = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomText += characters.charAt(randomIndex);
    }
  
    return randomText;
}
  
async function login(driver, username, pass) {
    await driver.get('http://127.0.0.1:3000/login');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(pass);
    
    const registrationButton = await driver.wait(until.elementLocated(By.id('login')), 5000);
    const innerDiv = await driver.wait(until.elementLocated(By.css('#login > div:last-child')), 5000);
    await innerDiv.click();
    
    await driver.wait(until.alertIsPresent());
    let alert = await driver.switchTo().alert();
    await alert.accept();
}

async function dismissAlert(driver) {
    try {
        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        await alert.dismiss();
    } catch (error) {
        console.error('Error dismissing alert:', error);
    }
}

async function clickStartButton(driver) {
    const startButtonLocator = By.id('start_tournament');
    try {
        await driver.wait(until.elementLocated(startButtonLocator), 5000);
        const startButton = await driver.findElement(startButtonLocator);
        await startButton.click();
    } catch (error) {
        console.error('Error finding or clicking the start button:', error);
    }
}

async function testTournament(players,username, pass, message, order) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await login(driver, username, pass);
        await dismissAlert(driver);
        await clickStartButton(driver);
        
        
        for (let i = 0; i < players.length; i++){
            await driver.findElement(By.id('player-name')).sendKeys(players[i]);
            innerDiv = await driver.wait(until.elementLocated(By.id('add-player')), 5000);
            await innerDiv.click();
        }

        const launch = await driver.wait(until.elementLocated(By.id('launch-tournamet')), 5000);
        await launch.click();



        await driver.wait(until.alertIsPresent());


        let tournament_alert = await driver.switchTo().alert();
        let tournament_alertText = await tournament_alert.getText();

        if (tournament_alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', tournament_alertText + resetColor);
        else {
            console.log('👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇');
            console.log(redColor + order, ' 😱 Test failed Alert Text: expected', message, '😬😬😬 got ➡️>', tournament_alertText + resetColor);
            console.log('👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆');
        }
    } finally {
        await driver.quit();
    }
}


async function testInputTournament(players,username, pass, message, order) {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await login(driver, username, pass);
        await dismissAlert(driver);
        await clickStartButton(driver);
        
        
        let addPlayer;
        let tournament_alert;
        let tournament_alertText;
        for (let i = 0; i < players.length; i++){
            await driver.findElement(By.id('player-name')).sendKeys(players[i]);
            innerDiv = await driver.wait(until.elementLocated(By.id('add-player')), 5000);
            await innerDiv.click();
            if (i == 1){
                await driver.wait(until.alertIsPresent());
                tournament_alert = await driver.switchTo().alert();
                tournament_alertText = await tournament_alert.getText();              
            }
        }
        if (players.length == 1){

            await driver.wait(until.alertIsPresent());
            tournament_alert = await driver.switchTo().alert();
             tournament_alertText = await tournament_alert.getText();
        }

        if (tournament_alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', tournament_alertText + resetColor);
        else {
            console.log('👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇');
            console.log(redColor + order, ' 😱 Test failed Alert Text: expected', message, '😬😬😬 got ➡️>', tournament_alertText + resetColor);
            console.log('👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆');
        }
    } finally {
        await driver.quit();
    }
}
async function tournamentInputTestCases(user){
    // testTournament([""], user, "3Aa322122233","Cannot launch tournament without players", 18);
    // testTournament(["ahmed"], user, "3Aa322122233","You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.", 19);
    let arr = ["6", "6"];
    testInputTournament(arr, user, "3Aa322122233","Player already added", 27);
    await (new Promise(resolve => setTimeout(resolve, 3000)));
    arr = ["     "];
    testInputTournament(arr, user, "3Aa322122233","Please enter a valid player name.", 27);
    arr = ["     \n"];
    testInputTournament(arr, user, "3Aa322122233","Please enter a valid player name.", 27);
    arr = ["     \t"];
    testInputTournament(arr, user, "3Aa322122233","Please enter a valid player name.", 27);
    await (new Promise(resolve => setTimeout(resolve, 3000)));
}

/*
  https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d3951b4aa9c63bfcc57b80e22872c5b27607beb50bb6f5eb315114be173f0b83
  &redirect_uri=http://localhost:3000/api/auth/callback/42-school
  &response_type=code
  &scope=public
  &state=a_very_long_random_string_witchmust_be_unguessable'

ogin-and-registeration
  */