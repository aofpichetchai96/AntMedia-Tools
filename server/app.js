const express = require('express');
const app = express();
const axios = require('axios');

//Cookie And Cors
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Config app
require('dotenv').config();
const config = process.env;

//Cors configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

//Middleware setup 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.post('/login', async (req, res) => {
    try{
        const { email, password, host, port } = req.body;
        if(!email || !password || !host || !port){
            const data = {  
                code: 998,
                message:'Data required incorrect.'
            };
            return res.status(200).json(data);
        }

        const api_login = `${host}:${port}/rest/v2/users/authenticate`;
        const data = {  email: email,  password: password }    

        let response = await axios.post(
            api_login,
            data,
            {                
                headers: {'Content-Type': 'application/json'}
            }
        );
        
        response = response.data;
        if(response.success === true){
            const data = {  
                            code: 1001,
                            message:'Successfully',
                            data: JSON.stringify(response)
                        };
            return res.status(200).json(data);
        } 
        else{
            const data = {  
                code: 999,
                message:'Login Filed'
            };
            return res.status(200).json(data);
        }

    }catch(err){
        return res.status(200).json(err.message);
    }
}); 


app.post('/check_api', async (req, res) => {
    try{
        const { email, password, host, port } = req.body;
        if(!email || !password || !host || !port){
            const data = {  
                code: 998,
                message:'Data required incorrect.'
            };
            return res.status(200).json(data);
        }

        const api_login = `${host}:${port}/rest/v2/users/authenticate`;
        const api_check = "http://192.168.1.100:5080/rest/v2/request?_path=LiveApp/rest/v2/broadcasts/create&autoStart=true";


        const data = {  email: email,  password: password }    
        
        let response = await axios.post(
            api_login,
            data,
            {                
                headers: {'Content-Type': 'application/json'}
            }
        );
        
        response = response.data;
        if(response.success === true){
            const data_add ={
                                "hlsViewerCount":0,
                                "dashViewerCount":0,
                                "webRTCViewerCount":0,
                                "rtmpViewerCount":0,
                                "mp4Enabled":0,
                                "playlistLoopEnabled":true,
                                "playListItemList":[],
                                "name":"AofTestADdasdasdasd55",
                                "streamUrl":"rtsp://172.20.0.53:554/profile2/media.smp",
                                "type":"streamSource"
                            }
            console.log(data_add);
            let res = await axios.post(
                api_check,
                data_add,
                {                
                    headers: {'Content-Type': 'application/json'}
                }
            );
            console.log(res);
            console.log(res.data);
            // rtsp://172.20.0.53:554/profile2/media.smp
            // AofTestADd

            // const data = {  
            //                 code: 1001,
            //                 message:'Successfully',
            //                 data: JSON.stringify(response)
            //             };
            // return res.status(200).json(res.data);
        } 
        else{
            const data = {  
                code: 999,
                message:'Login Filed'
            };
            return res.status(200).json(data);
        }

    }catch(err){
        return res.status(200).json(err.message);
    }
}); 


app.get('/', (req, res) => {
    res.send('Welcome to my API!');
})

app.use((req, res) => {
    res.status(404).send('Page not found.');
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});