async function greetUser() {
    const greetElement = document.getElementById('greet');
    if (!greetElement)
        return;

    try {
        // alert("sending request")
        const response = await fetch('http://localhost:8000/username/');
        if (response.ok) {
            const responseData = await response.json();
            // alert(responseData);
            
            const username = responseData.username;
            alert("hello")
            greetElement.textContent = `Hello ${username}`;
        } 
        else if (response.status === 401) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
        else 
            alert(`Error: ${response.status}`);
    } catch (error) {
        alert("Error fetching username:", error);
    }
}

greetUser();
