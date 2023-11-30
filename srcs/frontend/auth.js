// Get the current URL

// import storeJWTInCookies from index 

intraAuthenticate();

async function intraAuthenticate(){
  let code =  extractIntraAuthCode();
    
    try {
        if (code == null || code == "")
        {
            alert(`Registration or login failed`);
            throw new Error("Erro while intra authentication");
        }
        const response = await fetch('http://localhost:8000/auth/', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({code}),
        });
  
        const result = await response.json();
        if (response.ok && result.jwt_token) { 
          await storeJWTInCookies(result);
          window.location.href = 'landing.html';
        } else {
          alert(`Login failed: ${result.error}`);
        }
    }
    catch (error) {
        console.error('Error during registration:', error);
        alert(`Error during registration: ${error}`);
        window.location.href = 'index.html';
      }
}

function extractIntraAuthCode(){
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const codeValue = url.searchParams.get("code");
    return (codeValue);
}



async function  storeJWTInCookies(result)
{
  // Assuming 'response' is your fetch response
  //extract "jwt_token" from response body
  const jwt_token = result.jwt_token;
  if (!jwt_token)
    return (false);
    document.cookie = `Authorization=Bearer ${jwt_token}; Secure; SameSite=Strict`;
    return (true);
}



/*

var textField = document.getElementsByClassName("peer w-full h-full min-h-[100px] bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 resize-y disabled:bg-blue-gray-50 disabled:border-0 disabled:resize-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 min-h-full !border-0 focus:border-transparent")[0];

var button = document.getElementsByClassName("relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full")[0];
var textField = document.getElementsByClassName("peer w-full h-full min-h-[100px] bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 resize-y disabled:bg-blue-gray-50 disabled:border-0 disabled:resize-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 min-h-full !border-0 focus:border-transparent")[0];

textField.value = "hello using js";
button.click();

var button = document.getElementsByClassName("relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full")[0];
for (let i = 0; i < 10; i++)
{
    setTimeout(function() {
        // Your code to be executed after the delay
        button.click();
       
      }, 500);
}*/