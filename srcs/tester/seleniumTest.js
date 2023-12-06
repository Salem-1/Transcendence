const { Builder, By, Key, until } = require('selenium-webdriver');

const resetColor = '\x1b[0m';
const redColor = '\x1b[31m';
const greenColor = '\x1b[32m';
const yellowColor = '\x1b[33m';

async function runTest() {
    try{
        let user = generateRandomText(8);
        console.log(user)
        testRegister(generateRandomText(8), "3322122233", "3322122233" ,"Registration failed: password must contain at least one upper, lower case letters and number", 1);
        testRegister("user", "A12345678qwertyui", "A12345678qwertyui" ,"Registration failed: Username already taken", 2);
        testRegister("usedfgdfsgdsr", "", "3322122233" ,"Passwords too short, should be 8 cahr at leaset", 3);
        testRegister(generateRandomText(8), "3333", "3333" ,"Passwords too short, should be 8 cahr at leaset", 4);
        testRegister(generateRandomText(8), "", "" ,"Passwords too short, should be 8 cahr at leaset", 5);
        testRegister(generateRandomText(8), "aA0sdfasdfdsafasdfasd", "000Aa00000000" ,"Registration failed: Passwords do not match", 6);
        testRegister("", "3322122233", "3322122233" ,"Registration failed: Choose longer username", 7);
        await (new Promise(resolve => setTimeout(resolve, 1000)));
        testLogin("user2", "","Invalid request username or password", 9);
        testLogin("", "3322122233","Invalid request username or password", 10);
        await (new Promise(resolve => setTimeout(resolve, 1000)));
        testLogin("user'---", "3cC322122233","Invalid request username or password", 12);
        testRegister("users'-4-$'-", "3cC322122233", "3cC322122233" ,"Registration failed: Username cannot contain  those characters !@#$%^&*,.?\":;{} ' ' |<>'", 13);
        testRegister(user, "3Aa322122233", "3Aa322122233" ,"Registration successful! Now you can log in.", 14);
        testRegister(generateRandomText(8), "33221222Aa33", "33221222Aa33" ,"Registration successful! Now you can log in.", 15);
        testRegister("users@@", "33221Aa22233","33221Aa22233", "Registration failed: Username cannot contain  those characters !@#$%^&*,.?\":;{} ' ' |<>'" , 16);
        testLogin(user, "3Aa322122233","Successfull login", 17);
        // testIntraAuth("hello", 11);
    
    }
    catch (e)
    {
        console.log(e);
    }
}

runTest();

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
        await driver.get('http://localhost:3000/registration.html');
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
  


/*
  https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d3951b4aa9c63bfcc57b80e22872c5b27607beb50bb6f5eb315114be173f0b83
  &redirect_uri=http://localhost:3000/api/auth/callback/42-school
  &response_type=code
  &scope=public
  &state=a_very_long_random_string_witchmust_be_unguessable'

ogin-and-registeration
  */