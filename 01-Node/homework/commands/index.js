var fs = require("fs");
var request = require("request");
function date(data, done) {
  done(Date());
}

const pwd = (data, done) => {
  done(process.stdout.write(process.cwd()));
};

function ls(data, done) {
  // manera asincronica
  //   fs.readdir(".", function (err, files) {
  //     if (err) throw err;
  //     files.forEach(function (file) {
  //       process.stdout.write(file.toString() + "\n");
  //     });
  //     process.stdout.write("davi > ");
  //   });
  //   manera sincronica
  let output = "";
  const readedDir = fs.readdirSync(".");

  readedDir.forEach((file) => {
    output = output + file + "\n";
  });
  done(output);
}
function echo(data, done) {
  done(data.join(" "));
  //   process.stdout.write(data.join(" "));
}
// aca abria que definir una valriable que solo me arroja la lectura del aricho en una funcion para posteriormente llamarla en cat head y tail => obtenr la porcion deseada para que imprima lo que deseo.
const cat = (data, done) => {
  // con lectura asincrona es mucho mas legible y rapido de realizar, sin embargo,
  // al ser de manera sincrona para capturar el error utiliza
  // el try y catch se puede obviar pero si ocurre un error puede conllevar ciertos problemas
  try {
    const readFile = fs.readFileSync(data[0], "utf8");
    done(readFile);
  } catch (error) {
    throw error;
  }
};
function head(data, done) {
  fs.readFile(data[0], "utf8", (err, lectura) => {
    if (err) throw new err();
    else {
      done(lectura.split(" ").splice(0, 5).join("\n"));
    }
  });
}

const tail = (data, done) => {
  //  se plantea colocarlo sin error en catch pero por terminos de dejar varios ejemplos y que pueden estar ambos sin ningun problema
  //   para aprovechar la reutilizacionde codigo
  // utilizare el ya realizado en cat y no tener que repetir dicho codigo
  const f = fs.readFileSync(data[0], "utf8");
  done(f.split(" ").splice(-5, 5).join("\n"));
};

function curl(data, done) {
  request(`https://${data[0]}`, (err, resp, body) => {
    if (err) throw new err();
    else {
      done(body);
    }
  });
}

module.exports = {
  ls,
  clear: (data, done) => {
    console.clear();
    done("");
  },
  pwd,
  date,
  echo,
  cat,
  head,
  tail,
  curl,
};
