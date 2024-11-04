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

var Cookie = "";

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
        const setCookieHeader = response.headers['set-cookie'][0];
        Cookie = setCookieHeader.split(';')[0];

        response = response.data;
        if(response.success === true){
            
            const api_create = `${host}:${port}/rest/v2/applications-info`;
            let responseApplist = await axios.get(
                api_create,
                {                
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `${Cookie}`
                    },
                    withCredentials: true
                }
            );

            if(responseApplist.data){
                const data = {  
                        code: 1001,
                        message:'Successfully',
                        data: JSON.stringify(response),
                        apps: JSON.stringify(responseApplist.data)
                    };

                return res.status(200).json(data);

            }else{
                const data = {  
                    code: 999,
                    message:'Error in getting application list'
                };
                return res.status(200).json(data);
            }
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

// app.post('/checkapp', async (req, res) => {
//     try{
//         const { host, port } = req.body;
//         if(!host || !port){
//             const data = {  
//                 code: 998,
//                 message:'Data required incorrect.'
//             };
//             return res.status(200).json(data);
//         }

//         const api_create = `${host}:${port}/rest/v2/applications-info`;
//         let response = await axios.get(
//             api_create,
//             {                
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Cookie': `${Cookie}`
//                 },
//                 withCredentials: true
//             }
//         );

//         response = response.data;
//         if(response){    
//             const data = {  
//                             code: 1001,
//                             message:'Successfully',
//                             data: JSON.stringify(response)
//                         };
//             return res.status(200).json(data);
//         } 
//         else{
//             const data = {  
//                 code: 999,
//                 message:'Data not found.',
//             };
//             return res.status(200).json(data);
//         }

//     }catch(err){
//         return res.status(200).json(err.message);
//     }
// });

app.post('/create1', async (req, res) => {
    try{
        const { host, port, hostrtsp, name, streamid,app } = req.body; 
        if(!host || !port || !hostrtsp || !name || !streamid || !app){
            const data = {  
                code: 998,
                message:'Data required incorrect.'
            };
            return res.status(200).json(data);
        }
        const api_create = `${host}:${port}/rest/v2/request?_path=${app}/rest/v2/broadcasts/create&autoStart=true`;
      
        const data_create ={
                            "hlsViewerCount":0,
                            "dashViewerCount":0,
                            "webRTCViewerCount":0,
                            "rtmpViewerCount":0,
                            "mp4Enabled":0,
                            "playlistLoopEnabled":true,
                            "playListItemList":[],
                            "name": `${name}`,
                            "streamUrl":`${hostrtsp}${streamid}`,
                            "type":"streamSource"
                        }
        let response = await axios.post(
            api_create,
            data_create,
            {                
                headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `${Cookie}`
                        },
                withCredentials: true
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
                message:'add failed',
            };
            return res.status(200).json(data);
        }

    }catch(err){
        return res.status(200).json(err.message);
    }
}); 

app.post('/create2', async (req, res) => {
    try{
        const { name, rtsp_host, app, host, port } = req.body;
        if(!name || !rtsp_host || !app || !host || !port){
            const data = {  
                code: 998,
                message:'Data required incorrect.'
            };
            return res.status(200).json(data);
        }
        const api_create = `${host}:${port}/rest/v2/request?_path=${app}/rest/v2/broadcasts/create&autoStart=true`;
      
        const data_create ={
                            "hlsViewerCount":0,
                            "dashViewerCount":0,
                            "webRTCViewerCount":0,
                            "rtmpViewerCount":0,
                            "mp4Enabled":0,
                            "playlistLoopEnabled":true,
                            "playListItemList":[],
                            "name": `${name}`,
                            "streamUrl":`${rtsp_host}`,
                            "type":"streamSource"
                        }
        let response = await axios.post(
            api_create,
            data_create,
            {                
                headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `${Cookie}`
                        },
                withCredentials: true
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
                message:'add failed',
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