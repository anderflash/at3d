/**
* Representação da Câmera em uma cena
* @class ATShaderProgram
* @constructor
* @beta
* @since 0.0.1
*/
function ATShaderProgram(nome, gl)
{
  /**
  * Guarda o shader de vértices do programa
  * @property vShader
  * @type ATVertexShader
  */
  var vShader;
  /**
  * Guarda o shader de fragmentos do programa
  * @property fShader
  * @type ATFragmentShader
  */
  var fShader;
  
  var atributos = {};
  var uniforms = {};
  
  var codigos = [];
  
  var FLOAT = 1;
  var VEC2 = 2;
  var VEC3 = 3;
  var VEC4 = 4;
  var MAT3 = 5;
  var MAT4 = 6;
  var SAMPLER2D = 6;
  
  /**
  * Guarda o id do shaderprogram
  * @property programa
  * @type WebGLShaderProgram
  */
  var programa;
  
  var instancia = this;
  
  var getShader = function(shaderNome, tipo, callback)
  {
    var shader = gl.createShader(tipo);
    $.get(shaderNome, function(dados)
    {
      gl.shaderSource(shader, dados);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	throw "Não pode compilar shader do tipo "+tipo+" :\n\n"+gl.getShaderInfoLog(shader);
      codigos.push(dados);
      shader.codigo = dados;
      shader.nome = shaderNome;
      callback();
    });
    return shader;
  }
  
  /**
  * Carrega os shaders de vértice e fragmento e executa um callback com o resultado.
  * É um método assíncrono, recebe o retorno executando uma função passada como parâmetro.
  * Usado em {{#crossLink "ATEngine/carregarShaders:method"}}ATEngine.carregarShaders{{/crossLink}}
  * @method carregarShaders
  * @async
  * @return {Object} Um objeto com as seguintes propriedades.
  *                  - `programa`: a instância do ATShaderProgram
  */
  this.carregarShaders = function(vShaderNome, fShaderNome, callback)
  {
    var vShaderCarregado = false;
    var fShaderCarregado = false;
    vShader = getShader(vShaderNome, gl.VERTEX_SHADER, function()
    {
      if(fShaderCarregado) 
      {
	console.log(vShaderNome + "," + fShaderNome);
	carregarPrograma();
      }
      else vShaderCarregado = true;
      
    });//$.get(gl.createShader(gl.VERTEX_SHADER);
    fShader = getShader(fShaderNome, gl.FRAGMENT_SHADER, function()
    {
      if(vShaderCarregado)
      {
	console.log(vShaderNome + "," + fShaderNome);
	carregarPrograma();
      }
      else fShaderCarregado = true;
    });
    var carregarPrograma = function()
    {
      // Criar o programa
      programa = gl.createProgram();
      gl.attachShader(programa, vShader);
      gl.attachShader(programa, fShader);
      gl.linkProgram(programa);
      if(!gl.getProgramParameter(programa, gl.LINK_STATUS))
      {
	throw "Não pode compilar programa :\n\n"+gl.getProgramInfoLog(programa);
      }
      
      // Obter os atributos e uniforms
      for(var k = 0 ; k < codigos.length; k++)
      {
	var linhas = codigos[k].split('\n');
	var numLinhas = linhas.length;
	for(var i = 0 ; i < numLinhas; i++)
	{
	  if(linhas[i].length > 0)
	  {
	    var partes = linhas[i].split(' ');
	    if(partes[0] == "void") break;
	    var variavel = partes[2].replace(";","");
	    switch(partes[0])
	    {
	      case "attribute":
		atributos[variavel] = [gl.getAttribLocation(programa, variavel),
					parseInt(partes[1].substr(3,1))];
	      break;
	      case "uniform":
		uniforms[variavel] = [gl.getUniformLocation(programa, variavel)];
		switch(partes[1])
		{
		  case "float":uniforms[variavel].push(FLOAT);
		  break;
		  case "mat3": uniforms[variavel].push(MAT3);
		  break;
		  case "mat4": uniforms[variavel].push(MAT4);
		  break;
		  case "vec2": uniforms[variavel].push(VEC2);
		  break;
		  case "vec3": uniforms[variavel].push(VEC3);
		  break;
		  case "vec4": uniforms[variavel].push(VEC4);
		  break;
		  case "sampler2D": uniforms[variavel].push(SAMPLER2D);
		  break;
		}
	      break;
	    }
	  }
	}
      }
      callback({programa:instancia});
    };
  };
  this.usar = function()
  {
    
  };
  this.getNome = function()
  {
    return nome;
  }
}