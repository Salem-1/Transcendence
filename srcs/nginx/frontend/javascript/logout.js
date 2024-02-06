
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
		timedAlert(`${await getTranslation("logout failed")}: ${error}`);
    }
    catch (error){
        timedAlert(`${error}`);
    }
    return;
}
