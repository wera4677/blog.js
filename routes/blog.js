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

    res.render("post-detail",{ post:posts[0] });
});

module.exports = router;