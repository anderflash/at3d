/**
* É a raiz da estrutura da biblioteca
* Configura-se o ambiente, e criam-se as cenas usando esta classe.
* Você deve usar da seguinte forma:
* 
*     var engine = new ATEngine("canvas_id");
*     engine.carregarShaders({ATMaterialCor:["ArquivoVShader.glsl", "ArquivoFShader.glsl"]});
*     engine.pronto(function(){
*        var cena = engine.getCena();
*        var camera = engine.getCamera();
* 
*        // Construa a cena aqui
* 
*        cena.desenhar(camera);
*     });
* 
* @class ATEngine
* @constructor nomecanvas
* @param {String} nomecanvas a id do canvas que será usada para obter o contexto
* @beta
* @since 0.0.1
*/
function ATEngine(nomecanvas)
{
  /* -------------------
   * VARIÁVEIS PRIVADAS
   --------------------*/
  /**
  * Referência a si mesma (o `this` não funciona bem em 
  * funções assíncronas)
  * @private
  * @property engine
  * @type ATEngine
  * @beta
  * @since 0.0.1
  */
  var engine = this;
  /**
  * Se houver alguma chamada assíncrona, espere-a
  * @private
  * @property pendenciasAssincronas
  * @type {Object}
  * @beta
  * @since 0.0.1
  */
  var pendenciasAssincronas = {};
  /**
  * Referência ao canvas usado para desenhar o objeto
  * @private
  * @property canvas
  * @type HTMLCanvas
  * @beta
  * @since 0.0.1
  */
  var canvas = document.getElementById(nomecanvas);
  /**
  * Acesso ao contexto webgl
  * @private
  * @property gl
  * @type HTMLCanvas
  * @beta
  * @since 0.0.1
  */
  var gl = canvas.getContext("webgl") || 
           canvas.getContext("experimental-webgl");
  /**
  * Lista de cenas para desenhar
  * @private
  * @property cenas
  * @type Array<ATCena3D>
  * @beta
  * @since 0.0.1
  */
  var cenas = [new ATCena3D("cena")];
  
  /**
  * Lista de câmeras. Por padrão a engine provê 
  * uma câmera. Pode-se usar a mesma câmera para 
  * diferentes cenas.
  * @private
  * @property cameras
  * @type Array<ATCamera>
  * @beta
  * @since 0.0.1
  */
  var cameras = [new ATCamera("camera")];
  
  /**
  * Lista de programas de shaders
  * @private
  * @property programaShaders
  * @type Array<ATCena3D>
  * @beta
  * @since 0.0.1
  */
  var programasShaders = {};
  
  /* ---------------------
   * FUNÇÕES PRIVADAS
   * -------------------*/
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * despacha um evento interno que será ouvido pela função
  * pronta (se executada anteriormente)
  * @method verificarPendencias
  * @private
  * @beta
  * @since 0.0.1
  */
  var verificarPendencias = function()
  {
    for(var tipo in pendenciasAssincronas)
      if(!pendenciasAssincronas[tipo]) 
	return;
    this.dispatchEvent({type:"pronta"});
  }
  
  /* ---------------------
   * FUNÇÕES PÚBLICAS
   * -------------------*/
  /**
  * Recebe os arquivos que contém os shaders para os materiais, 
  * onde serão usados para renderizar os objetos. Além disso,
  * tentará obter as referências aos atributos e uniforms
  * @method carregarShaders
  * @param {Object} config Um objeto cujas chaves são as 
  *        classes dos materiais e os valores são
  *        listas com os nomes dos arquivos de 
  *        shaders
  * @beta
  * @since 0.0.1
  * @async
  * @example
  *     engine.carregarShaders({ATMaterialCor    :["vshadercor.glsl","fshadercor.glsl"], 
  *                             ATMaterialTextura:["vshadertex.glsl","fshadertex.glsl"]});
  */
  this.carregarShaders = function(config)
  {
    // Carregar cada um dos shaders
    for(var material in config)
    {
      // Criar um ATShaderProgram
      var programa = new ATShaderProgram(material, gl);
      programasShaders[material] = programa;
      pendenciasAssincronas[programa.getNome()] = false;
      
      // Obter o nome dos shaders
      var vShaderNome = config[material][0];
      var fShaderNome = config[material][1];
      
      var instancia = this;
      
      // Carregar os shaders de forma assíncrona
      programa.carregarShaders(vShaderNome, fShaderNome, function(resultado)
      {
        pendenciasAssincronas[resultado.programa.getNome()] = true;
        verificarPendencias.apply(instancia,null);
      });
    }
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method pronta
  * @param {Function} funcao a função que será executada 
  *          quando todas as pendências forem concluídas
  * @beta
  * @since 0.0.1
  */
  this.pronta = function(funcao){
    this.addEventListener("pronta",function(){funcao();});
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method criarCena
  * @param {String} nome O nome da cena
  * @beta
  * @since 0.0.1
  */
  this.criarCena = function(nome)
  {
    var cena = new ATCena3D(nome);
    cenas.push(cena);
    return cena;
  }
  
  /**
  * Cria uma câmera para ser usada em uma cena
  * executa a função passada como parâmetro
  * @method criarCamera
  * @param {String} nome O nome da câmera
  * @beta
  * @since 0.0.1
  */
  this.criarCamera = function(nome)
  {
    var camera = new ATCamera(nome);
    cameras.push(camera);
    return camera;
  }
  
  /**
  * Quando todas as tarefas da engine estiverem prontas,
  * executa a função passada como parâmetro
  * @method removerCena
  * @param ATCena3D nome a função que será executada 
  *        quando todas as pendências forem concluídas
  * @beta
  * @since 0.0.1
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
  * Quando habilitado, o canvas redimensionar-se-á para toda a 
  * janela, sendo sincronizada a qualquer mudança da janela.
  * __OBS__: é necessário ver como melhorar essa função para 
  * aceitar espaços para outros elementos da página, como se
  * fosse um layout líquido.
  * @method fullScreen
  * @param {Boolean} habilitado Se o valor é _true_ então o canvas 
  *                  será redimensionado e os eventos de redimensionamento 
  *                  da janela serão rastreadas. Se o valor é _false_, 
  *                  então o redimensionamento não estará
  * @beta
  * @since 0.0.1
  */
  this.fullScreen = function(habilitado)
  {
    
  }
}
ATUtils.EventDispatcher.prototype.apply( ATEngine.prototype );
