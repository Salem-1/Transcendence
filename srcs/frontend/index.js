

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;

    
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
      alert(`Registration failed: ${error}`);
    }
}

async function registerAuth(){
  alert("intra register pressed.");
  return ;
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
        alert(`Successful! log in welcome ${result.message}.`);
        window.location.href = 'landing.html';
        // greetUser(username, "username");
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert(`Error during registration: ${error}`);
    }
  }


//   function hash(s) {
//     /* Simple hash function. */
//     var a = 1, c = 0, h, o;
//     if (s) {
//         a = 0;
//         /*jshint plusplus:false bitwise:false*/
//         for (h = s.length - 1; h >= 0; h--) {
//             o = s.charCodeAt(h);
//             a = (a<<6&268435455) + o + (o<<14);
//             c = a & 266338304;
//             a = c!==0?a^c>>21:a;
//         }
//     }
//     return String(a);
// };

function isValidRegeistrationIput(username, password, confirmPassword)
{
    
    if (username.length < 1)
      alert("Registration failed: Choose longer username");
    else if ((password.length < 8))
        alert("Passwords too short, should be 8 cahr at leaset");
    else if (/[ !@#$%^&*(),.;?":{}|<>' ]/.test(username))
      alert("Registration failed: Username cannot contain  those characters !@#$%^&*,.?\":;{} ' ' |<>'");
      else if (!(/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)))
      {
        alert("Registration failed: password must contain at least one upper, lower case letters and number");
      }
      
      else if (password !== confirmPassword)
      alert("Registration failed: Passwords do not match");
      else
      return (true);
      return (false);   
    }
    
    function isValidLoginIput(username, password)
    {
      if (username.length > 1 && (password.length > 8) && !(/[ !@#$%^&*(),.;?":{}|<>' ]/.test(username)))
      return (true);
    alert("Invalid request username or password");
    return (false);   
}


/**
 * peer w-full h-full min-h-[100px] bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 resize-y disabled:bg-blue-gray-50 disabled:border-0 disabled:resize-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 min-h-full !border-0 focus:border-transparent
 */

/** Button
 * relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full
 */