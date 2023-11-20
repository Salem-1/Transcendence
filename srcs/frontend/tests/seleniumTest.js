const { Builder, By, Key, until } = require('selenium-webdriver');

const resetColor = '\x1b[0m';
const redColor = '\x1b[31m';
const greenColor = '\x1b[32m';
const yellowColor = '\x1b[33m';

async function runTest() {

    testRegister(generateRandomText(8), "3322122233", "3322122233" ,"Registration successful! Now you can log in.", 1);
    testRegister("user", "3322122233", "3322122233" ,"Registration failed: Username already taken", 2);
    testRegister("usedfgdfsgdsr", "", "3322122233" ,"Passwords too short, should be 8 cahr at leaset", 3);
    testRegister(generateRandomText(8), "3333", "3333" ,"Passwords too short, should be 8 cahr at leaset", 4);
    testRegister(generateRandomText(8), "", "" ,"Passwords too short, should be 8 cahr at leaset", 5);
    testRegister(generateRandomText(8), "asdfasdfdsafasdfasd", "00000000000" ,"Passwords do not match", 6);
    testRegister("", "3322122233", "3322122233" ,"Choose longer username", 7);
    testLogin("user1", "3322122233","Successful! log in.", 8);
    testLogin("user2", "","Invalid request username or password", 9);
    testLogin("", "3322122233","Invalid request username or password", 10);
    // testLogin("user2", "3322122233","Registration failed: Username already taken", 9);
    // testLogin("user4", "3322122233","Registration failed: Username already taken", 11);
    // testLogin("user5", "3322122233","Registration failed: Username already taken", 12);
    
}

runTest();

async function testRegister(username, pass, repass, message, order)
{

    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('http://127.0.0.1:3000/srcs/frontend/index.html');
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
        await driver.get('http://127.0.0.1:3000/srcs/frontend/login.html');
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
  

 