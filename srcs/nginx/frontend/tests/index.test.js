// const { register } = require('../index.js');
async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  // let b = JSON.stringify({ username, password });
  // alert(b);
  try {
    const response = await fetch('https://localhost:443/api/register/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Registration successful! Now you can log in.');
      window.location.href = 'login.html';
    } else {
      alert(`Registration failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert(`Error during registration: ${error}`);
  }
}
const { register } = require('../index');

describe('Registration Form', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="registrationForm">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>

        <br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>

        <br>

        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>

        <br>

        <button type="button" onclick="register()">Register</button>
      </form>
    `;
  });

  it('should match passwords', async () => {
    document.getElementById('username').value = 'testuser';
    document.getElementById('password').value = 'password123';
    document.getElementById('confirmPassword').value = 'password123';

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    await register();

    expect(alert).toHaveBeenCalledWith('Registration successful! Now you can log in.');
  });

  it('should handle passwords not matching', async () => {
    document.getElementById('username').value = 'testuser';
    document.getElementById('password').value = 'password123';
    document.getElementById('confirmPassword').value = 'password456';

    await register();

    expect(alert).toHaveBeenCalledWith('Passwords do not match');
  });

  // Add more test cases as needed
});


//npm init -y 
//npm install --save-dev jest @testing-library/jest-dom @testing-library/dom

//npm install --save-dev jest-environment-jsdom-fifteen
