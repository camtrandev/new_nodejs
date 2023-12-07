const express = require('express');
import bodyParser from "body-parser";
const configViewEngine = require('./src/config/viewEngine');
import initWebroutes from './src/routes/web';
require('dotenv').config();
const connectDB = require('./src/config/Databasc');
// mặc định chorme sẽ chạn khi gọi API với các tên miền khác nhau nên dùng cors (vd: chạy trên công 3000 và 8080)
const cors = require('cors')

let app = express();

// sử dụng cors 
// app.use(cors({ origin: true }));
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    origin: true,
}

app.use(cors(corsOptions))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

configViewEngine(app);
initWebroutes(app);

connectDB();

let port = process.env.PORT || 2004;

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})