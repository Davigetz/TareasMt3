// debido a que se quiere modulalizar pero sin perder el cmd es que se realiza la modularizacion con [cmd]()
const commands = require("./commands");

// Output un prompt
process.stdout.write("davi > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
const done = (output) => {
  process.stdout.write(output);
  process.stdout.write("\ndavi > ");
};
process.stdin.on("data", function (data) {
  var cmd = data.toString().trim().split(" "); // remueve la nueva línea
  let comando = cmd.shift();
  //   primero llamo al objeto commands y paso comando si la encuentro entonces
  //   invoco la funciolsn con "(`argumentos`)" que lo contiene
  //   luego le envio el `argumentos` comp cmd
  if (commands[comando]) commands[comando](cmd, done);
  else process.stdout.write("El comando no es reconocido");
});

//  el refactor con el done se hizo
// pero elrefactor se hace para que tenga una mejor funcionalidad completa.
// en donde no se repita tantp el codigo
