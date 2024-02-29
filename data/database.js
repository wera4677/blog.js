//데이터베이스 연결을 설정하는 코드
const mysql = require("mysql2/promise"); //데이터베이스 연결을 도와주는 패키지 

const pool = mysql.createPool({
    host: "localhost", //연결될 url
    database: "blog",  //데이터베이스에 연결하고있음을 명시
    user : "root",
    password: "wera4677"
});//데이터베이스 연결 풀을 설정하고 자동관리



module.exports = pool; //pool을 내보냄 
