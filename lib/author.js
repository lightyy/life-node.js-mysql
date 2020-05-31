var db = require("./db");
var template = require("./template.js");
var qs = require("querystring");

exports.home = function (request, response) {
  db.query(`select * from topic`, (err, topics) => {
    db.query(`select * from author`, (err, authors) => {
      var title = "author";
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `
        ${template.authorTable(authors)}
        <div>　</div>
        <form action = '/author/create_process' method = 'post'>
        <div>
            <input type ='text' name = 'name' placeholder = 'name' />
        </div>
        <div>
            <input type ='text' name = 'profile' placeholder = 'profile' />
        </div>
        <div>
            <input type = 'submit' value = 'create'/>
        </div>
        </form>
      <style>
        table{
            border-collapse : collapse;
            text-align : center;
            width : 50vw;
        }
        td{
            border : 1px solid black;
        }
      </style>
      `,
        `
      `
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `insert into author(name,profile) values(?,?)`,
      [post.name, post.profile],
      (err, result) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response, queryData) {
  db.query(`select * from topic`, (err, topics) => {
    db.query(`select * from author`, (err, authors) => {
      db.query(
        `select * from author where id=?`,
        [queryData.id],
        (err3, author) => {
          var title = "author";
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list,
            `
                ${template.authorTable(authors)}
                <div>　</div>
                <form action = '/author/update_process' method = 'post'>
                <div>
                    <input type ='hidden' name = 'id' value = '${
                      queryData.id
                    }' />
                </div>
                <div>
                    <input type ='text' name = 'name' placeholder = 'name' value = '${
                      author[0].name
                    }' />
                </div>
                <div>
                    <input type ='text' name = 'profile' placeholder = 'profile' value = '${
                      author[0].profile
                    }'/>
                </div>
                <div>
                    <input type = 'submit' value = 'update'/>
                </div>
                </form>
              <style>
                table{
                    border-collapse : collapse;
                    text-align : center;
                    width : 50vw;
                }
                td{
                    border : 1px solid black;
                }
              </style>
              `,
            `
              `
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `update author set name=?,profile=? where id=?`,
      [post.name, post.profile, post.id],
      (err, results) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `delete from topic where author_id=?`,
      [post.id],
      (err1, result1) => {
        if (err1) throw err1;
        db.query(
          `delete from author where id=?`,
          [post.id],
          (err2, results2) => {
            if (err2) throw err2;
            response.writeHead(302, { Location: `/author` });
            response.end();
          }
        );
      }
    );
  });
};
