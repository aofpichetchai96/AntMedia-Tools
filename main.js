var host = "http://127.0.0.1";
var port = "5080";

document.getElementById("host").value = host;
document.getElementById("port").value = port;

if(localStorage.getItem("authenticated") == "true"){   
    let email = localStorage.getItem("email");
    document.getElementById("login-time-input").value = `Email : ${email}`;

    document.getElementById("login-action").style.display = "none";
    document.getElementById("login-time").style.display = "block";   
}

document.getElementById("button-save-host").addEventListener("click", function() {
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;

    localStorage.setItem("host", host);
    localStorage.setItem("port", port);

    const CheckstoredHost = localStorage.getItem("host");
    const CheckstoredPort = localStorage.getItem("port");

    if(CheckstoredHost && CheckstoredPort) {
        Swal.fire({
            title: "Save Success!",
            text: "You clicked the button!",
            icon: "success"
        });
    }
    else{
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });
    }       
});

window.addEventListener("load", function() {
    const storedHost = localStorage.getItem("host");
    const storedPort = localStorage.getItem("port");

    if (storedHost && storedPort) {
        document.getElementById("host").value = storedHost;
        document.getElementById("port").value = storedPort;
    }
}); 

async function login(){

    const host = localStorage.getItem("host");
    const port = localStorage.getItem("port");
    if(!host || !port) {
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });
        window.location.reload();
    }

    var login_api = 'http://127.0.0.1:3009/login';
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    const data = {   
        email: email, 
        password: CryptoJS.MD5(password).toString(),
        host: host,
        port: port     
    }
 
    try {        
        var response = await axios.post(
            login_api,
            data,
            {                
                headers: { 'Content-Type': 'application/json'}
            }
        );
        response = response.data;

        if(response.code == 1001){
            response = JSON.parse(response.data);

            const message = response.message.split("/");
            localStorage.setItem("authenticated", response.success);
            localStorage.setItem("email", email);
            localStorage.setItem("password", CryptoJS.MD5(password).toString());
            localStorage.setItem("role", message[1]);
            localStorage.setItem("scope", message[0]);  
            
            await Swal.fire({
                title: "Login Success!",
                text: "You clicked the button!",
                icon: "success"
            });
            window.location.reload();

        }else{
            Swal.fire({
                title: "Login Failed!",
                text: "You clicked the button!",
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
    }
}

async function logout(){
    localStorage.removeItem("authenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("scope");    
    localStorage.removeItem("password");    
    const email = localStorage.getItem("email");
    if(!email || !port) {
        await Swal.fire({
            title: "Logout Success!",
            text: "You clicked the button!",
            icon: "success"
        });
        window.location.reload();
    }else{
        await Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
    }
}


async function check_api(){

    const host = localStorage.getItem("host");
    const port = localStorage.getItem("port");
    if(!host || !port) {
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });
        window.location.reload();
    }
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if(!email || !password) {
        logout();
        Swal.fire({
            title: "Sesssion Failed! Please Login Again!",
            text: "You clicked the button!",
            icon: "error"
        });
        window.location.reload();
    }

    var login_api = 'http://127.0.0.1:3009/check_api';
    const data = {   
        email: email, 
        password: CryptoJS.MD5(password).toString(),
        host: host,
        port: port     
    }

    try {        
        var response = await axios.post(
            login_api,
            data,
            {                
                headers: { 'Content-Type': 'application/json'}
            }
        );
        response = response.data;
        console.log("DATA => ",response);

        
    } catch (error) {
        console.log(error.message);
    }
 
}