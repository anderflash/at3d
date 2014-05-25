/**
* Classe para funções que são externos às classes da engine
* que servirão como ferramentas auxiliares
* @class ATUtils
* @beta
* @since 0.0.1
*/ 
var ATUtils = {};

ATUtils.atributos = {
  POSICAO:"aVertexPosition",
  COR:"aVertexColor",
  NORMAL:"aVertexNormal",
  COORDTEX:"aVertexTexCoord",
  INDICE:"indice",
};

// took this right from require('util').inherits
ATUtils.inherits = function(ctor, superCtor) { 
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

/**
* Classe para despachadores de eventos
* @class ATUtils.EventDispatcher
* @beta
* @since 0.0.1
*/ 
ATUtils.EventDispatcher = function () {
  
}
ATUtils.EventDispatcher.prototype = {
  pendenciasAssincronas:{},
	constructor: ATUtils.EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = ATUtils.EventDispatcher.prototype.addEventListener;
		object.hasEventListener = ATUtils.EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = ATUtils.EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = ATUtils.EventDispatcher.prototype.dispatchEvent;

	},
  
  /**
  * Adicionar uma pendência assíncrona
  * @method adicionarPendencia
  * @param {String} nome O nome da classe que tratará os eventos
  * @param {Object} objeto A referência ao pedido que a classe está tratando
  * @beta
  * @since 0.0.1
  */
  adicionarPendencia:function(nome, objeto)
  {
    if(!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome))
      ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
    ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = false;
  },
  
  /**
  * Remover uma pendência assíncrona
  * @method removerPendencia
  * @param {String} nome O nome da classe que tratará os eventos
  * @param {Object} objeto A referência ao pedido que a classe está tratando
  * @beta
  * @since 0.0.1
  */
  removerPendencia:function(nome, objeto)
  {
    if(!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome))
      ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
    ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = true;
  },
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * despacha um evento interno que será ouvido pela função
  * pronta (se executada anteriormente)
  * @method verificarPendencias
  * @private
  * @beta
  * @since 0.0.1
  */
  verificarPendencias:function(nome)
  {
    if(ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome))
    {
      for(var tipo in ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome])
        if(!ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][tipo]) return
    }
    ATUtils.EventDispatcher.prototype.dispatchEvent({type:nome+"pronta"});
  },
  
  
	addEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};
		var listeners = this._listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}
		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	},

	hasEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return false;
		var listeners = this._listeners;
		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
			return true;
		}
		return false;
	},

	removeEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return;
		var listeners = this._listeners;
		var listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			var index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	},

	dispatchEvent: function ( event ) {
		if ( this._listeners === undefined ) return;
		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
			event.target = this;
			var array = [];
			var length = listenerArray.length;
			for ( var i = 0; i < length; i ++ ) {
				array[ i ] = listenerArray[ i ];
			}
			for ( var i = 0; i < length; i ++ ) {
				array[ i ].call( this, event );
			}
		}
	}
};

Array.prototype.pushArray = function() {
    var toPush = this.concat.apply([], arguments);
    for (var i = 0, len = toPush.length; i < len; ++i) {
        this.push(toPush[i]);
    }
};