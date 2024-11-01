
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
    }

    var login_api = `${host}:${port}/rest/v2/users/authenticate`;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    try {
        password = CryptoJS.MD5(password).toString();
        var response = await axios.post(
            login_api,
            { email: email, password: password },
            {                
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }
        );
        response = response.data;

        if(response.success === true) {
            const message = await response.message.split("/");
            localStorage.setItem("authenticated", response.success);
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
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
        Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
    }
}


async function login_allowed(){
    const host = localStorage.getItem("host");
    const port = localStorage.getItem("port");
    if(!host || !port) {
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });return;
    }

    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if(!email || !password) {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("scope");    
        localStorage.removeItem("password");           
        Swal.fire({
            title: "Data Not found!",
            text: "You clicked the button!",
            icon: "error"
        });return;
    }

    var login_api = `${host}:${port}/rest/v2/users/authenticate`;
    var api_add =`${host}:${port}/rest/v2/request?_path=PirmidOffice/rest/v2/broadcasts/create&autoStart=true&socialNetworks=`;
    try { 

        var response = await axios.post(login_api,{ email: email, password: password });
        console.log('headers => ',response.headers);
        console.log('data => ', response.data);  
        
        var dats_set = {
            "hlsViewerCount":0,
            "dashViewerCount":0,
            "webRTCViewerCount":0,
            "rtmpViewerCount":0,
            "mp4Enabled":0,
            "playlistLoopEnabled":true,
            "playListItemList":[],
            "streamUrl":"rtsp://172.20.0.53:554/profile2/media.smp",
            "name":"AofTestADd",
            "type":"streamSource"
        }
        var res = await axios.post(
            api_add,
            dats_set,
            {                
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'JSESSIONID=669F17415D87F452BC86F31A017CC544',
                    'Host': '117.121.216.70:5080',
                    'Origin': 'http://117.121.216.70:5080',
                    'Referer': 'http://117.121.216.70:5080/'
                }
            }
        );
        console.log(res);
        console.log(res.data);  
        
    } catch (error) {
       console.log(error.message);
       return;
    }    
}

// async function check_api(){
    
//     try {
//         const login = await login_allowed();
//         console.log(login);
//         if(login === true) {
//             var res = await axios.get(
//                 "http://117.121.216.70:5080/rest/v2/request?_path=PirmidOffice/rest/v2/broadcasts/list/0/10&sort_by=&order_by=",
//                 {                           
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
//             console.log(res);
//             console.log(res.data);
//         }
//         else{
//            console.log("Login Field Error check_api.");
//         }
       
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }


// const url = `${host}:${port}/rest/v2/users/authenticate`;
// const data = {
//     email: email, 
//     password: password
// };
// try {
//     const response = await axios.post(url, data);
    
//     // เข้าถึงค่า Set-Cookie
//     const setCookieHeader = response.headers['set-cookie'];
    
//     // ตรวจสอบว่ามีค่า Set-Cookie หรือไม่
//     if (setCookieHeader) {
//         console.log('Set-Cookie Header:', setCookieHeader);
        
//         // ถ้าต้องการดึงค่า JSESSIONID
//         const sessionIdMatch = setCookieHeader[0].match(/JSESSIONID=([^;]+)/);
        
//         if (sessionIdMatch && sessionIdMatch[1]) {
//             const sessionId = sessionIdMatch[1];
//             console.log('JSESSIONID:', sessionId);
//         } else {
//             console.log('ไม่พบ JSESSIONID');
//         }
//     } else {
//         console.log('ไม่มี Set-Cookie Header');
//     }
// } catch (error) {
//     console.error('Error during request:', error);
// }