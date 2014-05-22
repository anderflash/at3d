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
      codigos.push(dados);
      callback();
    });
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
    vShaderCarregado = false;
    fShaderCarregado = false;
    vShader = getShader(vShaderNome, gl.VERTEX_SHADER, function()
    {
      if(fShaderCarregado) carregarPrograma();
      else vShaderCarregado = true;
      
    });//$.get(gl.createShader(gl.VERTEX_SHADER);
    fShader = getShader(fShaderNome, gl.FRAGMENT_SHADER, function()
    {
      if(vShaderCarregado) carregarPrograma();
      else fShaderCarregado = true;
    });
    var carregarPrograma = function()
    {
      // Criar o programa
      programa = gl.createProgram();
      gl.attachShader(programa, vShader);
      gl.attachShader(programa, fShader);
      gl.linkProgram(programa);
      
      // Obter os atributos e uniforms
      for(var k = 0 ; k < codigo.length; k++)
      {
	var linhas = codigo[k].split('\n');
	var numLinhas = linhas.length;
	for(var i = 0 ; i < numLinhas; i++)
	{
	  if(linhas.length > 0)
	  {
	    var partes = linhas[i].split(' ');
	    switch(partes[0])
	    {
	      case "attribute":
		atributos[partes[2]] = [gl.getAttribLocation(programa, partes[2]),
					parseInt(partes[1].substring(3,1))];
	      break;
	      case "uniform":
		uniforms[partes[2]] = [gl.getUniformLocation(programa, partes[2])];
		switch(partes[1])
		{
		  case "float":uniforms[partes[2]].push(FLOAT);
		  break;
		  case "mat3": uniforms[partes[2]].push(MAT3);
		  break;
		  case "mat4": uniforms[partes[2]].push(MAT4);
		  break;
		  case "vec2": uniforms[partes[2]].push(VEC2);
		  break;
		  case "vec3": uniforms[partes[2]].push(VEC3);
		  break;
		  case "vec4": uniforms[partes[2]].push(VEC4);
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
}