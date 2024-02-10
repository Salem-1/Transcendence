
async function    logout(){
    try{
        await tryLogoutuser();
    }
    catch (error){
        timedAlert(`${error}`);
    }
    return;
}

async function  tryLogoutuser(){
    const response = await fetch("http://localhost:443/logout/",{
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