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
  
  // Jogar o gl para a biblioteca de materiais
  ATMaterialLib.gl = gl;
  ATParser.gl = gl;
  gl.clearColor(0.0,0.0,0.3,1.0);
  
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
  
  /* ---------------------
   * FUNÇÕES PÚBLICAS
   * -------------------*/
  /**
  * Retornar a cena a partir do nome. Se chamada sem parâmetro, então retorna
  * a primeira cena. Se não encontrar a cena, retorna null
  * @method getCena
  * @param {String}{Number} [nome] O nome ou índice da cena. Se não vier, então retorna a primeira cena.
  * @beta
  * @since 0.0.1
  * @example
  *     engine.getCena(); // A primeira cena
  *     engine.getCena("cena"); // A cena de nome "cena"
  *     engine.getCena(2); "A terceira cena"
  */
  this.getCena = function(nome)
  {
    // Caso 1: usando getCena sem parâmetro
    // Retorna o primeiro
    if(nome === null || nome === undefined) return cenas[0];
    
    if(typeof nome === 'string')
    {
      // Caso 2: procurando pelo nome
      var num = cenas.length;
      for(var i = 0; i < num; i++)
        if(cenas[i].getNome() == nome) return cenas[i];
        
      // Caso 3: não encontrou o nome
      return null;
    }
    else return cenas[nome];
  }
  
  /**
  * Retornar a câmera a partir do nome. Se chamada sem parâmetro, então retorna
  * a primeira câmera. Se não encontrar a câmera, retorna null
  * @method getCena
  * @param {String}{Number} [nome] O nome ou índice da câmera. Se não vier, então retorna a primeira câmera.
  * @beta
  * @since 0.0.1
  * @example
  *     engine.getCamera(); // A primeira câmera
  *     engine.getCamera("camera"); // A cena de nome "câmera"
  *     engine.getCamera(2); "A terceira câmera"
  */
  this.getCamera = function(nome)
  {
    // Caso 1: usando getCena sem parâmetro
    // Retorna o primeiro
    if(nome === null || nome === undefined) return cameras[0];
    
    if(typeof nome === 'string')
    {
      // Caso 2: procurando pelo nome
      var num = cameras.length;
      for(var i = 0; i < num; i++)
        if(cameras[i].getNome() == nome) return cameras[i];
        
      // Caso 3: não encontrou o nome
      return null;
    }
    else return cameras[nome];
  }
  
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
      ATUtils.EventDispatcher.prototype.adicionarPendencia(this.constructor.name, programa.getNome());
      
      // Obter o nome dos shaders
      var vShaderNome = config[material][0];
      var fShaderNome = config[material][1];
      
      var instancia = this;
      
      // Carregar os shaders de forma assíncrona
      programa.carregarShaders(vShaderNome, fShaderNome, function(resultado)
      {
        ATUtils.EventDispatcher.prototype.removerPendencia(instancia.constructor.name, resultado.programa.getNome());
        ATUtils.EventDispatcher.prototype.verificarPendencias(instancia.constructor.name);
      });
    }
  }
  
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
  this.carregarOBJ = function(nome,caminho)
  {
    var cena = this;
    ATUtils.EventDispatcher.prototype.adicionarPendencia(this.constructor.name, caminho);
    var objeto = ATParser.carregarOBJ(nome,caminho, function(objeto)
    {
      ATUtils.EventDispatcher.prototype.removerPendencia(cena.constructor.name, objeto.caminho);
      ATUtils.EventDispatcher.prototype.verificarPendencias(cena.constructor.name);
    });
    return objeto;
  };
  
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
    var funcao2 = function()
    {
      ATUtils.EventDispatcher.prototype.removeEventListener(this.constructor.name+"pronta", funcao2);
      funcao();
    };
    ATUtils.EventDispatcher.prototype.addEventListener(this.constructor.name+"pronta",funcao2);
  };
  
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
  };
  
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
  };
  
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
  };
  
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
    
  };
  
  /**
  * Desenhar a cena utilizando a câmera
  * @method desenhar
  * @param {Boolean} habilitado Se o valor é _true_ então o canvas 
  *                  será redimensionado e os eventos de redimensionamento 
  *                  da janela serão rastreadas. Se o valor é _false_, 
  *                  então o redimensionamento não estará
  * @beta
  * @since 0.0.1
  */
  this.desenhar = function(cena, camera)
  {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(/*<UNIFORM PARA VIEW MATRIX>*/, camera.getViewMatrix());
    gl.uniformMatrix4fv(/*<UNIFORM PARA PROJECTION MATRIX>*/, camera.getProjectionMatrix());
    desenharObjeto(cena, mat4.create());
  };
  
  /**
  * Desenhar um mesh
  * @method desenharMesh
  * @param {ATMesh} mesh a ser desenhado
  * @param {Array} matriz resultante da multiplicação de todos as matrizes de modelo dos ancestrais
  * @beta
  * @since 0.0.1
  */
  var desenharMesh = function(mesh, matrizModeloPai)
  {
    var geometria = mesh.getGeometria(); 
    var matrizModelo = mat4.create();
    mat4.mult(matrizModelo, matrizModeloPai, mesh.getModelMatrix());
    if(geometria)
    {
      // ASSOCIAR OS BUFFERS AOS ATRIBUTOS DO SHADER
      // TODO: como fazer para generalizar os atributos?
      
      // Usar as posicoes
      var posicoes = geometria.getListaIndexadaPosicoes();
      if(posicoes.length)
      {
        // Bind no buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geometria.getBufferPosicoes());
        // Associar ao shader
        gl.vertexAttribPointer(/*TODO:<ATRIBUTO DA POSIÇÃO>*/, 3, gl.FLOAT, false, 0, 0);
      }
      // Usar as normais
      var normais = geometria.getListaIndexadaNormais();
      if(normais.length)
      {
        // Bind no buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geometria.getBufferNormais());
        // Associar ao shader
        gl.vertexAttribPointer(/*TODO:<ATRIBUTO DA NORMAL>*/, 3, gl.FLOAT, false, 0, 0);
      }
      // Usar as coord de textura
      var texturas = geometria.getListaIndexadaCoordTexturas();
      if(texturas.length)
      {
        // Bind no buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geometria.getBufferTexturas());
        // Associar ao shader
        gl.vertexAttribPointer(/*TODO:<ATRIBUTO DA TEXTURA>*/, 2, gl.FLOAT, false, 0, 0);
      }
      
      // Usar as cores
      var cores = geometria.getListaIndexadaCores();
      if(cores.length)
      {
        // Bind no buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geometria.getBufferCores());
        // Associar ao shader
        gl.vertexAttribPointer(/*TODO:<ATRIBUTO DA COR>*/, 4, gl.FLOAT, false, 0, 0);
      }
      
      // Atualizar o modelMatrix
      gl.uniformMatrix4fv(/*<UNIFORM DO MODEL MATRIX>*/, false, mesh.getModelMatrix());
      
      // TODO: Como fazer para mandar uniforms específicos 
      // para cada mesh (e qualquer tipo)
      
      // TODO: Associar as texturas
      // TODO: Como fazer para associar todas as texturas
      //       nos seus respectivos samplers
      // Difusa
      var material = mesh.getMaterial();
      gl.bindTexture(gl.TEXTURE_2D, material.getTexturaDifusa());
      gl.activeTexture(gl.["TEXTURE"+material.getTexturaDifusa().unit]);
      gl.uniform1i(/*TODO:<UNIFORM PARA TEXTURA DIFUSA>*/, material.getTexturaDifusa().unit);
      
      // Desenhar de fato
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometria.getBufferIndices());
      gl.drawElements(gl.TRIANGLES, geometria.getListaIndices().length, gl.UNSIGNED_SHORT, 0);
    }
  };
  
  /**
  * Desenhar um objeto. Se for um container de objetos, desenha os filhos (recursivamente).
  * Antes disso, as matrizes de modelo vão se combinando
  * @method desenharMesh
  * @param {ATObjeto3D} objeto a ser desenhado
  * @param {Array} matriz resultante da multiplicação de todos as matrizes de modelo dos ancestrais
  * @beta
  * @since 0.0.1
  */
  var desenharObjeto = function(objeto, matrizModeloPai)
  {
    var matrizModelo = mat4.create();
    mat4.mult(matrizModelo, matrizModeloPai, objeto.getModelMatrix());
    
    for(var i = 0; i < objeto.getQtdFilhos(); i++)
    {
      var filho = objeto.getFilho(i);
      if(filho instanceof ATMesh) desenharMesh(filho, matrizModelo);
      else if(filho instanceof ATObjeto3D) desenharObjeto(filho, matrizModelo);
    }
  };
}