
async function    logout(){
    try{
        await tryLogoutuser();
    }
    catch (error){
        alert(`${error}`);
    }
    return;
}

async function  tryLogoutuser(){
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
alert(`${await getTranslation("logout failed")}: ${error}`);
}