// Get the current URL




async function intraAuthenticate(){
    let code =  extractCode();
    alert(`Code Value: ${code}`);
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
          body: JSON.stringify({ code }),
        });
  
        const result = await response.json();
  
        if (response.ok) { //do the login part here
          alert('Successful! Intra log in.');
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

function extractCode(){
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const codeValue = url.searchParams.get("code");
    return (codeValue);
}

intraAuthenticate();