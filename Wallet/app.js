// 실행환경 보기
// 새로운 회사 적응하느냐 nest로 못할지도 ?
// 트랙픽 처리 
let runmode = process.argv.slice(-1)[0];
global.env = process.env;

// nest로 바꾸기
// 환경변수 설정
require("dotenv").config();

if (runmode === "local" || "start")
  require("dotenv").config({ path: __dirname + "/config/.env_local" });
else if (runmode === "prod")
  require("dotenv").config({ path: __dirname + "/config/.env_prod" });
else require("dotenv").config({ path: __dirname + "/config/.env_prod" });

console.log("runmode", runmode);

const express              = require('express'); 
const cors                 = require("cors");
const fs                   = require('fs');
const app                  = express();
const path                 = require('path')
const indexRouter          = require('./routes');
const userRouter           = require('./routes/user');
const accountRouter        = require('./routes/eth')
const transactionRouter    = require('./routes/transaction');
const swapRouter           = require('./routes/swap');
const adminRouter          = require('./routes/admin');
const storeRouter          = require('./routes/store')
const bodyParser           = require('body-parser');
const image                = require('./controllers/upload-image')
const cookieParser         = require('cookie-parser');
const swaggerUi            = require("swagger-ui-express");
const swaggerFile          = require("./swagger/swagger-output.json");
app.use(cors({origin: "*",}));// 모든 출처 허용 옵션. true 를 써도 된다.

app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded형태의 데이터를 해석
app.use(express.json()); // json 형태의 데이터를 해석
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(bodyParser.json()); // json 등록
app.use(bodyParser.urlencoded({ extended: false })); // URL-encoded 등록

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// nodejs middleware for appliaction <-- 이거뜸
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");  // cors 문제 해결
// 	res.header("Access-Control-Allow-Headers", "*"); // cors 문제 해결
// 	console.log('middleware for appliaction');
// });

// 단일 파일 업로드
app.post("/upload", image.single, image.uploads);

// 다중 파일 업로드
app.post("/multipart", image.multa, image.multi_uploads);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/eth", accountRouter);
app.use("/transaction", transactionRouter);
app.use("/swap", swapRouter);
app.use("/admin", adminRouter);
app.use("/store", storeRouter);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(global.env.NODE_SERVER_PORT, () => {
  console.log("server running on port " + global.env.NODE_SERVER_PORT);
});
