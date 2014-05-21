/**
* Classe para funções que são externos às classes da engine
* que servirão como ferramentas auxiliares
* @beta
* @since 0.0.1
*/ 
function ATUtils(){}
ATUtils.inherits = function(ctor, superCtor) { // took this right from require('util').inherits
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};