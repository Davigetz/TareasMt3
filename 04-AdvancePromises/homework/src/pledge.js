"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  if (typeof executor !== "function")
    throw new TypeError("executor no es una function");
  this._state = "pending";
  this._value = undefined;
  this._handlerGroups = [];

  executor(
    (value) => this._internalResolve(value),
    (reason) => this._internalReject(reason)
  );
}

$Promise.prototype.then = function (successCb, errorCb) {
  let downstreamPromise = new $Promise(function () {});
  if (typeof successCb != "function") successCb = false;
  if (typeof errorCb != "function") errorCb = false;
  let objCb = {
    successCb: successCb,
    errorCb: errorCb,
    downstreamPromise,
  };
  this._handlerGroups.push(objCb);
  if (this._state != "pending") {
    this._callHandlers();
  }

  return downstreamPromise;
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let objactual = this._handlerGroups.shift();
    let downstreamPromise = objactual.downstreamPromise;

    if (this._state === "fulfilled") {
      if (!objactual.successCb) {
        downstreamPromise._internalResolve(this._value);
      } else {
        try {
          let resultSuccess = objactual.successCb(this._value);
          if (resultSuccess instanceof $Promise) {
            resultSuccess.then(
              (value) => {
                downstreamPromise._internalResolve(value);
              },
              (razon) => {
                downstreamPromise._internalReject(razon);
              }
            );
          } else {
            downstreamPromise._internalResolve(resultSuccess);
          }
        } catch (error) {
          downstreamPromise._internalReject(error);
        }
      }
    }

    if (this._state === "rejected") {
      if (!objactual.errorCb) {
        downstreamPromise._internalReject(this._value);
      } else {
        try {
          let resultErrorCb = objactual.errorCb(this._value);
          if (resultErrorCb instanceof $Promise) {
            resultErrorCb.then(
              (value) => {
                downstreamPromise._internalResolve(value);
              },
              (razon) => {
                downstreamPromise._internalReject(razon);
              }
            );
          } else {
            downstreamPromise._internalResolve(resultErrorCb);
          }
        } catch (error) {
          downstreamPromise._internalReject(error);
        }
      }
    }
  }
};

$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = "fulfilled";
    this._value = value;
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (reason) {
  if (this._state === "pending") {
    this._state = "rejected";
    this._value = reason;
    this._callHandlers();
  }
};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
