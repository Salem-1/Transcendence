//test_OTP123

async function enable2FA(email){
    if (notValidEmail(email))
        throw new Error("Please enter a valid email address.");
    if ((await submit2FaEmail(email)))
        throw new Error("Internal server error");
    
    //prompt for otp
    let otp = get_otp();
    //send the otp along with the email to the back end
    await sendEnable2faEmail(otp, email);

    return (true);
}

async function sendEnable2faEmail(otp, email){
    const response = await fetch('https://localhost:443/api/enable_2fa_email/',{
        method: "POST", 
        headers: {
            "Content-Type" : "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({otp,email}),
    }
    );
    const result = await response.json();
    if (response.ok)
        return (true);
    else
        throw new Error("Invalid otp");
}


async function submit2FaEmail(email) {
        const response = await fetch('http://localhost:8000/submit_2fa_email/',{
            method: "POST", 
            headers: {
                "Content-Type" : "application/json",
            },
            credentials: "include", 
            body: JSON.stringify({email}),
        }
        );
        const result = await response.json();
        if (response.ok)
            return (true);
        else
            throw new Error("Couldn't submit email for double factor authentication");
  }



function  notValidEmail(email){
    if (!email || email.length < 5 || email.length > 80  
            || email.indexOf("@") < 1 || email.indexOf(".") < 1 
            ||  containsForbiddenchar(email)  || email.split("@").length - 1 > 1)
        return (true);
    return (false);
}

function containsForbiddenchar(email){
            
    let forbidden_chars = ["'", "\"", "\\", "#", "$", "%", 
                        "^", "&", "*", "(", ")", "!"];

    return ([...email].some(char => forbidden_chars.includes(char)));
}


module.exports = {
    enable2FA: enable2FA,
    notValidEmail: notValidEmail,
    submit2FaEmail: submit2FaEmail,

};

//npm install --save-dev jest jest-fetch-mock



