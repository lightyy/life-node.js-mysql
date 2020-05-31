var db = require("./db");
var template = require("./template.js");
var qs = require("querystring");

exports.home = function (request, response) {
  db.query(`select * from topic`, (err, topics, fields) => {
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response, queryData) {
  db.query(`select * from topic`, (err, topics, fields) => {
    if (err) throw err;
    db.query(
      `select * from topic left join author on topic.author_id = author.id where topic.id=?`,
      [queryData.id], //공격을 피하는 팁
      (err2, topic) => {
        if (err2) throw err2;
        // console.log(topic);
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(
          title,
          list,
          `
          <h2>${title}</h2>${description}
          <p>by ${topic[0].name}</p>
          `,
          `<a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`select * from topic`, (err, topics, fields) => {
    db.query(`select*from author`, (err2, authors) => {
      var title = "CREATE";
      var list = template.list(topics);
      var html = template.HTML(
        title,
        list,
        `
        <a href="/create">create</a>
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_preocess = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `insert into topic 
    (title,description,created,author_id)values(?,?,now(),?)`,
      [post.title, post.description, post.author],
      (err, result) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response, queryData) {
  db.query(`select*from topic`, (err, topics) => {
    if (err) throw err;
    db.query(
      `select * from topic where id=?`,
      [queryData.id], //공격을 피하는 팁
      (err2, topic) => {
        if (err2) throw err2;
        db.query(`select*from author`, (err3, authors) => {
          if (err3) throw err3;
          var list = template.list(topics);
          var html = template.HTML(
            topic[0].title,
            list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${
                topic[0].title
              }"></p>
              <p>
                <textarea name="description" placeholder="description">${
                  topic[0].description
                }</textarea>
              </p>
              <p>
              ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
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
      `update topic set title=?,description=?,author_id=? where id=?`,
      [post.title, post.description, post.author, post.id],
      (err, results) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${post.id}` });
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
    db.query(`delete from topic where id=?`, [post.id], (err, results) => {
      if (err) throw err;
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  });
};
