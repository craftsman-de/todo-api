let env = process.env.NODE_ENV || 'development';

if(env==='development' || env ==='test'){
    let config = require('./config.json');
    
    let envConfig = config[env];

    Object.keys(envConfig).forEach((key)=> {
        process.env[key]=envConfig[key];
    });
    // process.env.PORT = envConfig.PORT;
    // process.env.MONGODB_URI = envConfig.MONGODB_URI;
}
