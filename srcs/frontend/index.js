

// async function register(){
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
    
//     try{
//       const response = await fetch('http://localhost:8000/register');
//     }
//     catch (error){
//       alert(`Error during registration: ${error}`);
//     }
// }

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!isValidRegeistrationIput(username, password, confirmPassword))
        return ;
    
      try {
      const response = await fetch('http://localhost:8000/register/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username,  password}),
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

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!isValidLoginIput(username, password))
      return ;
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Successful! log in.');
        window.location.href = 'landing.html';
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(`Error during registration: ${error}`);
    }
  }


  function hash(s) {
    /* Simple hash function. */
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
};

function isValidRegeistrationIput(username, password, confirmPassword)
{
    if (username.length < 1)
      alert("Choose longer username");
      else if ((password.length < 8))
        alert("Passwords too short, should be 8 cahr at leaset");
    else if (password !== confirmPassword)
      alert("Passwords do not match");
    else
      return (true);
    return (false);   
}

function isValidLoginIput(username, password)
{
    if (username.length > 1 && (password.length > 8))
      return (true);
    alert("Invalid request username or password");
    return (false);   
}