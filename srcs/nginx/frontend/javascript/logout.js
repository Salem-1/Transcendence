
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
    const response = await fetch("https://localhost:443/api/logout/",{
        method: "GET",
        headers :{
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
if (response.ok) {
    callRoute("/");
    return;
}
timedAlert(`${await getTranslation("logout failed")}: ${error}`);
}