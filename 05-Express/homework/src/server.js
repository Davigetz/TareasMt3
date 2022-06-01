// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];
let id = 1;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

server.get("/", function (req, res) {
  res.status(200).send("paPitOs a paSaRla gueno!");
});

server.get("/search", function (req, res) {
  var obj = {
    saludo: "Hola " + req.query.name,
  };
  res.json(obj);
});
// TODO: your code to handle requests
server.post("/posts", function (req, res) {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  let p = {
    id: id++,
    author,
    title,
    contents,
  };

  posts.push(p);
  res.json(p);
});

server.post("/posts/author/:author", function (req, res) {
  const { title, contents } = req.body;
  const { author } = req.params;

  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }

  let p = {
    id: id++,
    author: author,
    title: title,
    contents: contents,
  };

  posts.push(p);
  res.json(p);
});

server.get("/posts", function (req, res) {
  if (req.query.term) {
    const rta = posts.filter(
      (p) =>
        p.title.includes(req.query.term) || p.contents.includes(req.query.term)
    );
    return res.json(rta);
  }
  res.json(posts);
});

server.get("/posts/:author", function (req, res) {
  const result = posts.filter((p) => p.author === req.params.author);

  if (result.length > 0) {
    return res.json(result);
  } else {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe ningun post del autor indicado" });
  }
});

server.get("/post/:author/:title", function (req, res) {
  const { author, title } = req.params;
  const result = posts.filter((p) => p.author === author && p.title === title);

  if (result.length === 0) {
    return res.status(STATUS_USER_ERROR).send({
      error: "No exite ningun post con dicho titulo y autor indicado",
    });
  }
  res.json(result);
});

server.put("/posts", function (req, res) {
  const { id, title, contents } = req.body;
  if (!id || !title || contents) {
    return res.status(STATUS_USER_ERROR).send({
      error:
        "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }

  const post = posts.find((p) => p.id === id);
  if (!post)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe un post con ese id" });
  res.json(post);
});

server.delete("/posts", function (req, res) {
  const { id } = req.body;

  if (!id) return res.status(STATUS_USER_ERROR).json({ error: "No tengo id!" });
  const post = posts.find((p) => p.id === id);
  if (!post)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "El id no corresponde a algun post existente" });

  posts = posts.filter((p) => p.id !== id);
  res.json({ success: true });
});

server.delete("/author", function (req, res) {
  const { author } = req.body;
  if (!author)
    return res
      .send(STATUS_USER_ERROR)
      .json({ error: "No se encuentra ningun author con ese nombre" });

  const result = posts.filter((p) => p.author !== author);

  if (!result.length)
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No exite el autor indicado" });

  posts = posts.filter((p) => p.author !== author);
  res.json(result);
});

module.exports = { posts, server };
