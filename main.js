var host = "http://127.0.0.1";
var port = "5080";

document.getElementById("host").value = host;
document.getElementById("port").value = port;

if(localStorage.getItem("authenticated") == "true"){   
    let email = localStorage.getItem("email");
    document.getElementById("login-time-input").value = `Email : ${email}`;

    document.getElementById("login-action").style.display = "none";
    document.getElementById("login-time").style.display = "block";   

    document.getElementById("create-streams").style.display = "block";  
}

document.getElementById('streamid-name1').value = '';
document.getElementById('streamid-name2').value = '';
function changeButtonText(newText) {
    document.getElementById('actionButton').innerText = newText;
}

function showDiv(action1Div, action2Div) {

    var div1 = document.getElementById('action1-from');
    var div2 = document.getElementById('action2-from');

    div1.style.display = 'none';
    div2.style.display = 'none';

    if (action1Div !== 'none') {
        document.getElementById(action1Div).style.display = 'block';
    }
    if (action2Div !== 'none') {
        document.getElementById(action2Div).style.display = 'block';
    }
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
     
        const applist = JSON.parse(localStorage.getItem("applist")) || []; 
        const appSelect = document.getElementById("appSelect");
                
        applist.forEach(app => {
            const option = document.createElement("option");
            option.value = app; 
            option.textContent = app; 
            appSelect.appendChild(option);
        });
        
        appSelect.addEventListener("change", function() {
            const selectedValue = this.value;
        });
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
        return;
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
            let appliat = JSON.parse(response.apps)
            response = JSON.parse(response.data);          

            const message = response.message.split("/");
            localStorage.setItem("authenticated", response.success);
            localStorage.setItem("email", email);
            localStorage.setItem("password", CryptoJS.MD5(password).toString());
            localStorage.setItem("role", message[1]);
            localStorage.setItem("scope", message[0]);  

            if(Object.keys(appliat).length > 0) {
                const NamesAppList = appliat.map(item => item.name);
                localStorage.setItem("applist", JSON.stringify(NamesAppList)); 
            }
            await Swal.fire({
                title: "Login Success!",
                text: "You clicked the button!",
                icon: "success"
            });
            window.location.reload();
            return;

        }else{
            Swal.fire({
                title: "Login Failed!",
                text: "You clicked the button!",
                icon: "error"
            });
            return;
        }
    } catch (error) {
        Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
        return;
    }
}

async function logout(){
    localStorage.removeItem("authenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("scope");    
    localStorage.removeItem("password");    
    localStorage.removeItem("applist");    
    const email = localStorage.getItem("email");
    if(!email || !port) {
        await Swal.fire({
            title: "Logout Success!",
            text: "You clicked the button!",
            icon: "success"
        });
        window.location.reload();
        return;
    }else{
        await Swal.fire({
            title: "Login Failed!",
            text: "You clicked the button!",
            icon: "error"
        });
        return;
    }
}

async function Confirme_action1() {
    await Swal.fire({
        title: 'Confirme Create?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Create!'
    }).then((result) => {
        let res = result.isConfirmed;
        if(res){
            // console.log('OK')
            let app             = document.getElementById("appSelect").value;
            let hostrtsp        = document.getElementById("host-rtsp").value;
            let streamidname    = document.getElementById("streamid-name1").value;
            let data = {
                app: app,
                hostrtsp: hostrtsp,
                streamidname: streamidname
            }
            console.log(data);
        }
        else return false;   
    });
    return;
}

async function Confirme_action2() {
    const host = localStorage.getItem("host");
    const port = localStorage.getItem("port");
    if(!host || !port) {
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });
        window.location.reload();
        return;
    }

    await Swal.fire({
        title: 'Confirme Create?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Create!'
    }).then( async (result) => {
        let res = result.isConfirmed;
        if(res){
            let data_creates_result = [];
            let app             = document.getElementById("appSelect").value;
            let streamidname    = document.getElementById("streamid-name2").value;
            if(app === undefined || app === null || app === ""){
                await Swal.fire({
                    title: "Invalid app data selection!",
                    text: "You clicked the button!",
                    icon: "error"
                });
                return;
            }

            if(streamidname === undefined || streamidname === null || streamidname === ""){
                await Swal.fire({
                    title: "Invalid rpst Link And Name data!",
                    text: "You clicked the button!",
                    icon: "error"
                });
                return;
            }

            Swal.fire({
                title: 'Processing...',
                text: 'Please wait while we process your data.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const result = streamidname.trim().split('\n').map(line => {
                const [url, cam] = line.split(',');
                return  `${url},${cam}`
            });
          
            for (let i = 0; i < result.length; i++) {                
                let data = {
                    app: app,
                    streamidname: result[i]
                }
                let rs_create = await create2(data);
                if(rs_create.code == 1001){                    
                    let result_data =  JSON.parse(rs_create.data);
                    if(result_data.success == true){
                        let dataNew = {
                            app: app,
                            streamidname: result[i],
                            http: `${host}:${port}/${app}/play.html?id=${result_data.dataId}`,
                            success: result_data.success,
                            dataId: result_data.dataId
                        }
                        data_creates_result.push(dataNew);
                    }
                    else{
                        let dataNew = {
                            app: app,
                            streamidname: streamidname,
                            success: false
                        }
                        data_creates_result.push(dataNew);
                    }                    
                }
                await new Promise(resolve => setTimeout(resolve, 500));                  
            }
            Swal.close();

            localStorage.setItem("data_creates_result", JSON.stringify(data_creates_result));  

            await Swal.fire({
                title: "Create Success!",
                text: "You clicked the button!",
                icon: "success"
            });
            window.location.reload();
            return;

        }
        else return false;   
    });
    return;
}


async function create2(data){

    const host = localStorage.getItem("host");
    const port = localStorage.getItem("port");
    if(!host || !port) {
        Swal.fire({
            title: "เช็ตค่า Host และ Port ให้ถูกต้อง!",
            text: "You clicked the button!",
            icon: "error"
        });
        window.location.reload();
        return;
    }

    var api_create = 'http://127.0.0.1:3009/create2';
    const [rtspUrl, name] = data.streamidname.split(',');
    const dataAdd = {   
        host: host,
        port: port,     
        name: name,   
        rtsp_host: rtspUrl,     
        app: data.app     
    }

    try {        
        var response = await axios.post(
            api_create,
            dataAdd,
            { headers: { 'Content-Type': 'application/json'}}
        );
        response = response.data;
        return response;        
    } catch (error) {
        console.log(error.message);
    } 
}