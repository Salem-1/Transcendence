//test_OTP123

async function enable2FA(email){
    if (notValidEmail(email))
        throw new Error("Please enter a valid email address.");
    if ((await submit2FaEmail(email)))
        throw new Error("Internal server error");
    else
        return (true);
    //send email to the backend
    //prompt for otp
    //send the otp along with the email to the back end
    //validate the otp if correct enabled 2fa and store email
    //else error message
    return (email);
}



  
function  notValidEmail(email){
    if (!email || email.length < 5 || email.length > 80  
            || email.indexOf("@") < 1 || email.indexOf(".") < 1 
            ||  containsForbiddenchar(email)  || email.split("@").length - 1 > 1)
        return (true);
    return (false);
}

function containsForbiddenchar(email){
            
    forbidden_chars = ["'", "\"", "\\", "#", "$", "%", 
                        "^", "&", "*", "(", ")", "!"];

    return ([...email].some(char => forbidden_chars.includes(char)));
}



async function submit2FaEmail(email) {
    try{
        const response = await fetch('http://localhost:8000/submit_2fa_email/',{
            method: "POST", 
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({email}),
        }
        );
        const result = await response.json();
        if (response.ok)
            return (true);
    }
    catch (e){
        return (false);
    }
    return false;
  }



module.exports = {
    enable2FA: enable2FA,
    notValidEmail: notValidEmail,
    submit2FaEmail: submit2FaEmail,

};

//npm install --save-dev jest jest-fetch-mock



