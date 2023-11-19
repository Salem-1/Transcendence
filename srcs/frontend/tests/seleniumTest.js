const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://127.0.0.1:3000/srcs/frontend/index.html');

    // Your registration logic here
    await driver.findElement(By.id('username')).sendKeys('testuse');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.id('confirmPassword')).sendKeys('password123');
    await driver.findElement(By.css('button')).click();

    // Wait for registration to complete
    await driver.wait(until.alertIsPresent());

    // Verify the alert message
    let alert = await driver.switchTo().alert();
    let alertText = await alert.getText();
    console.log('Alert Text:', alertText);

    // Assert your expected result
    // For example, you can use an assertion library like Chai
    // assert.equal(alertText, 'Registration successful! Now you can log in.');
  } finally {
    await driver.quit();
  }
}

runTest();
