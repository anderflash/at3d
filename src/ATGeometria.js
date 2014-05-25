/**
* Abstração de Geometria
* @class ATGeometria
* @constructor
* @beta
* @since 0.0.1
*/
function ATGeometria(nome)
{
  var listas = {};
  var buffers = {};
  
  /**
  * Lista de Cores
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaCores = [];
  /**
  * Lista de Posicoes
  * @property listaCores;
  * @private
  * @type {Array}
  */
  var listaPosicoes = [];
  /**
  * Lista de Normais
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaNormais = [];
  /**
  * Lista de Coordenadas de Textura
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaCoordTexturas = [];
  
  /**
  * Lista Indexada de Cores
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaIndexadaCores = [];
  /**
  * Lista indexada de posições
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaIndexadaPosicoes = [];
  /**
  * Lista indexada de normais
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaIndexadaNormais = [];
  /**
  * Lista indexada de texturas
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaIndexadaCoordTexturas = [];
  
  /**
  * Lista de índices
  * @property listaCores;
  * @private
  * @type {Array}
  */ 
  var listaIndices = [];
  
  /**
  * Buffer de posição
  * @property bufferPosicoes;
  * @private
  * @type {WebGLBuffer}
  */ 
  var bufferPosicoes = null;
  /**
  * Buffer de textura
  * @property bufferCoordTexturas;
  * @private
  * @type {WebGLBuffer}
  */ 
  var bufferCoordTextura = null;
  /**
  * Buffer de normal
  * @property bufferNormais
  * @private
  * @type {WebGLBuffer}
  */ 
  var bufferNormais = null;
  /**
  * Buffer de cores
  * @property bufferCores;
  * @private
  * @type {WebGLBuffer}
  */ 
  var bufferCores = null;
  /**
  * Buffer de índices
  * @property bufferIndices;
  * @private
  * @type {WebGLBuffer}
  */ 
  var bufferIndices = null;
  
  this.getListaCores=function(){return listaCores;};
  this.getListaPosicoes=function(){return listaPosicoes;};
  this.getListaCoordTexturas=function(){return listaCoordTexturas;};
  this.getListaNormais=function(){return listaNormais;};
  this.getListaIndices=function(){return listaIndices;};
  this.getListaIndexadaCores=function(){return listaIndexadaCores;};
  this.getListaIndexadaCoordTexturas=function(){return listaIndexadaCoordTexturas;};
  this.getListaIndexadaPosicoes=function(){return listaIndexadaPosicoes;};
  this.getListaIndexadaNormais=function(){return listaIndexadaNormais;};
  
  this.limparListaCores = function(){listaCores = [];};
  this.limparListaPosicoes= function(){listaPosicoes = [];};
  this.limparListaCoordTexturas = function(){listaCoordTexturas = [];};
  this.limparListaNormais= function(){listaNormais = [];};
  this.limparListaIndices = function(){listaIndices = [];};
  this.limparListaIndexadaCores = function(){listaIndexadaCores = [];};
  this.limparListaIndexadaPosicoes = function(){listaIndexadaPosicoes = [];};
  this.limparListaIndexadaCoordTexturas = function(){listaIndexadaCoordTexturas = [];};
  this.limparListaIndexadaNormais = function(){listaIndexadaNormais = [];};
  
  this.getLista = function(nome)
  {
    return listas[nome];
  }
  this.getBuffer = function(nome)
  {
    return buffers[nome];
  }
  this.criarLista = function(nome)
  {
    listas[nome] = [];
  }
  this.existeLista(nome)
  {
    return listas.hasOwnProperty(nome);
  }
  this.setBuffer = function(nome, buffer)
  {
    buffers[nome] = buffer;
  }
}