const express = require("express");

const db = require("../data/database"); 

const router = express.Router();

router.get("/",function(req, res){
    res.redirect("/posts"); //경로를 다른쪽으로 돌린다.
});

router.get("/posts", async function(req, res){
    const query = `
    SELECT posts.*,authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.authors_id = authors.id
    `;
    const [posts] = await db.query(query); //목록 가져오기
    res.render("posts-list",{posts: posts}); //자동으로 파일을 찾고 반환
});

router.get("/new-post",async function(req,res){
   const [authors] = await db.query("select * from blog.authors"); 
    res.render("create-post",{authors:authors}); //DB데이터 내용을 템플릿에 전달 
});

router.post("/posts",async function(req,res){
    const data =[ //create-post.ejs 의 name ="" 을 나타냄
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,
    ];
   await db.query("INSERT INTO posts (title,summary,body,authors_id) VALUES (?)",[
    data,
    ]); //삽입

   res.redirect("/posts");
});

router.get("/posts/:id", async function(req, res){
    const query =`
        SELECT posts.*,authors.name AS author_name, authors.email AS author_email FROM posts 
        INNER JOIN authors ON posts.authors_id = authors.id
        WHERE posts.id = ? 
    `;//쿼리 작성

    const [posts] = await db.query(query,[req.params.id]);

    if (!posts || posts.length === 0 ){ //요청 주소가 잘못된경우 404오류 
        return res.status(404).render("404");
    }

    const postData = {
        ...posts[0], //단일 게시물의 모든데이터를 해당 객체로 가져온다.
        date : posts[0].date.toISOString(), //Mysql 패키지에 의해 자바스크립트 객체로 변환
        humanReadableDate : posts[0].date.toLocaleDateString("en-US",{
            weekday : "long",
            year : "numeric",
            month : "long",
            day : "numeric"
        }) //다른 내장 메소드인 날짜 객체를 호출할수있음
    };

    res.render("post-detail",{ post:postData });
});

router.get("/posts/:id/edit", async function(req, res){ //업데이트전 페이지에 보여줌
    const query =`
    SELECT * FROM posts WHERE id = ?
    `;
    const [posts] = await db.query(query,[req.params.id]);

    if (!posts || posts.length === 0 ){ //요청 주소가 잘못된경우 404오류 
        return res.status(404).render("404");
    }

    res.render("update-post", { post: posts[0]});
});

router.post("/posts/:id/edit", async function(req, res){ //업데이트 하기
    const query = `
    UPDATE posts SET title = ?, summary = ? , body = ?
    WHERE id = ? 
    `;

    await db.query(query, [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.params.id
    ]); // 4개의 ? 이기때문에 순서에 맞춰서 작성

    res.redirect("/posts")
});

router.post("/posts/:id/delete", async function(req, res){ //게시물 삭제
    await db.query("DELETE FROM posts WHERE id = ? ", [req.params.id]);
    
    res.redirect("/posts"); 
});

module.exports = router;