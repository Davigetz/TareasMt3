var fs = require("fs");
var http = require("http");

// Escribí acá tu servidor
http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.end("API ShowByName");
    } else {
      //  manera sincrona
      try {
        const readImage = fs.readFileSync(
          __dirname + `/images/${req.url}_doge.jpg`
        );
        res.end(readImage);
      } catch (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("imagen no encontrada");
      }
      // manera asincronica
      //   fs.readFile('',(err,data)=>{
      //       if(err) console.log(err)
      //       else {
      //           res.end(data)
      //       }
      //   })
    }
  })
  .listen(3001, () => {
    console.log("Servidor listen en el puerto 3001");
  });
