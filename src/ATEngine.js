/**
* É a raiz da estrutura da biblioteca
* Configura-se o ambiente, e criam-se as cenas usando esta classe
* @class ATEngine
* @constructor
*/
function ATEngine(nomecanvas)
{
  /* -------------------
   * Variáveis Privadas
   --------------------*/
  /**
  * Referência a si mesma (o this não funciona bem em funções assíncronas)
  * @private
  * @property engine
  * @type ATEngine
  */
  var engine = this;
  /**
  * Se houver alguma chamada assíncrona, espere-a
  * @private
  * @property pendenciasAssincronas
  * @type {Object}
  */
  var pendenciasAssincronas = {};
  /**
  * Acesso ao canvas
  * @private
  * @property canvas
  * @type HTMLCanvas
  */
  var canvas = document.getElementById(nomecanvas);
  /**
  * Acesso ao contexto webgl
  * @private
  * @property gl
  * @type HTMLCanvas
  */
  var gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
  /**
  * Lista de cenas para desenhar
  * @private
  * @property cenas
  * @type Array<ATCena3D>
  */
  var cenas = [];
  /**
  * Lista de programas de shaders
  * @private
  * @property programaShaders
  * @type Array<ATCena3D>
  */
  var programasShaders = {};
  
  /* ---------------------
   * FUNÇÕES PARA SHADERS
   * -------------------*/
  /**
  * Recebe os arquivos que contém os shaders para os materiais, 
  * onde serão usados para renderizar os objetos
  * @method carregarShaders
  * @param {Object} config Um objeto cujas chaves são as 
  *        classes dos materiais e os valores são
  *        listas com os nomes dos arquivos de 
  *        shaders
  */ 
  this.carregarShaders = function(config)
  {
    for(var nomeShader in config)
    {
      this.pendenciasAssincronas[programa] = false;
      var vShaderNome = config[nomeShader][0];
      var fShaderNome = config[nomeShader][1];
      var programa = new ShaderProgram();
      programasShaders[nomeShader] = programa;
      programa.carregarShaders(gl, vShaderNome, fShaderNome, function(resultado)
      {
	programasShaders[resultado.programa] = true;
	verificarPendencias();
      });
    }
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method pronta
  * @param {Function} funcao a função que será executada quando todas as pendências forem concluídas
  */ 
  this.pronta = function(funcao){
    this.addEventListener("pronta",function(e){funcao();});
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method criarCena
  * @param {String} nome a função que será executada quando todas as pendências forem concluídas
  */ 
  this.criarCena = function(nome)
  {
    var cena = new ATCena3D(nome);
    cenas.push(cena);
    return cena;
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method removerCena
  * @param ATCena3D nome a função que será executada quando todas as pendências forem concluídas
  */ 
  this.removerCena = function(cena)
  {
    var indice = cenas.indexOf(cena);
    if(indice != -1)
    {
      cenas.splice(indice,1);
      cena.destruir();
    }
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * despacha um evento interno que será ouvido pela função pronta
  * (se executada anteriormente)
  * @method verificarPendencias
  * @private
  */ 
  var verificarPendencias = function()
  {
    for(var tipo in engine.pendenciasAssincronas)
      if(!engine.pendenciasAssincronas[tipo]) 
	return;
    engine.dispatchEvent(new Event("pronta"));
  }
}