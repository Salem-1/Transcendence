function homePageBody(){
    return (`
    <h1>You are logged in ya basha</h1>
        <h1 id="greet">Hello User</h1>
        <button type="button" onclick="enable2FA()">Enable 2FA</button>
        <button type="button" onclick="disable2FA()">Disable2 FA</button>
        <button type="button" id="start_tournament" onclick='callRoute("/register_players")'>Start Tournament</button>
        <button type="button" onclick="callRoute('/game')">Play game</button>
        `)
}