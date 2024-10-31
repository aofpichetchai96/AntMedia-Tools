
var host = "http://127.0.0.1";
var port = "5080";

document.getElementById("host").value = host;
document.getElementById("port").value = port;

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
    }

    var login_api = `${host}:${port}/rest/v2/users/authenticate`;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    try {
        var response = await axios.post(
            login_api,
            { email: email, password: CryptoJS.MD5(password).toString() },
            {                
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        );
        response = response.data;
        // console.log(response);
        // console.log(response.success);      
        if(response.success === true) {
            const message = response.message.split("/");
            localStorage.setItem("authenticated", response.success);
            localStorage.setItem("email", email);
            localStorage.setItem("role", message[1]);
            localStorage.setItem("scope", message[0]);          

            Swal.fire({
                title: "Login Success!",
                text: "You clicked the button!",
                icon: "success"
            });
        }else{
            Swal.fire({
                title: "Login Failed!",
                text: "You clicked the button!",
                icon: "error"
            });
        }

    } catch (error) {
        console.log(error.message);
        Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
    }
}

// async function check_api(){
//     try {
//         var response = await axios.get(
//             "http://117.121.216.70:5080/rest/v2/applications-info",
//             {                           
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     'Cookies': 'JSESSIONID=C647691C20B3DD543426D5EB2347A4D0'
//                 }
//             }
//         );
//         // response = response.data;
//         console.log(response);
//         console.log(response.data);
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }