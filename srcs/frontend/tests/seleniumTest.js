const { Builder, By, Key, until } = require('selenium-webdriver');

const resetColor = '\x1b[0m';
const redColor = '\x1b[31m';
const greenColor = '\x1b[32m';
const yellowColor = '\x1b[33m';

async function runTest() {

    testRegister(generateRandomText(8), "3322122233", "3322122233" ,"Registration successful! Now you can log in.", 1);
    testRegister("user", "12345678qwertyui", "12345678qwertyui" ,"Registration failed: Username already taken", 2);
    testRegister("users@@", "3322122233", "3322122233" ,"Registration failed: Username cannot contain @", 2);
    testRegister("usedfgdfsgdsr", "", "3322122233" ,"Passwords too short, should be 8 cahr at leaset", 3);
    testRegister(generateRandomText(8), "3333", "3333" ,"Passwords too short, should be 8 cahr at leaset", 4);
    testRegister(generateRandomText(8), "", "" ,"Passwords too short, should be 8 cahr at leaset", 5);
    testRegister(generateRandomText(8), "asdfasdfdsafasdfasd", "00000000000" ,"Passwords do not match", 6);
    testRegister("", "3322122233", "3322122233" ,"Choose longer username", 7);
    testLogin("user", "12345678qwertyui","Successful! log in.", 8);
    testLogin("user2", "","Invalid request username or password", 9);
    testLogin("", "3322122233","Invalid request username or password", 10);
    testIntraAuth("intra register pressed.", 11);
}

runTest();

async function testIntraAuth(message, order){
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000');
        await driver.findElement(By.xpath('//button[text()="Register via 42 intra"]')).click();
        
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
        else
            console.log(redColor + order,  ' 😱 Test failed Alert Text: expected', message, 'got ->>>', alertText + resetColor);
    }
    finally {
        await driver.quit();
    }
}
async function testRegister(username, pass, repass, message, order)
{
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000');
        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(pass);
        await driver.findElement(By.id('confirmPassword')).sendKeys(repass);
        await driver.findElement(By.css('button')).click();
        
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
        else
            console.log(redColor + order,  ' 😱 Test failed Alert Text: expected', message, 'got ->>>', alertText + resetColor);
    }
    finally {
        await driver.quit();
    }
}

async function testLogin(username, pass, message, order)
{

    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000/login');
        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(pass);
        await driver.findElement(By.css('button')).click();

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        if (alertText === message)
            console.log(greenColor + order, ' 😁 Test passed  Alert Text:', alertText +  resetColor);
        else
            console.log(redColor + order,  ' 😱 Test failed Alert Text: expected', message, 'got ->>>', alertText + resetColor);
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