
async function    logout(){
    try{
        const response = await fetch("http://localhost:8000/logout/",{
                method: "GET",
                headers :{
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
        if (response.ok) {
            callRoute("/home");
		    return;
        }
        alert(`failed to logout status code ${response.status}`);
    }
    catch (error){
        alert(`${error}`);
    }
    return;
}
