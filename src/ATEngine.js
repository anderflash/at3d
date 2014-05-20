function ATEngine(nomecanvas)
{
  var engine = this;
  this.pendenciasAssincronas = {};
  var canvas = document.getElementById(nomecanvas);
  var gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
  var cenas = [];
  var programasShaders = {};
  
  /* ---------------------
   * FUNÇÕES PARA SHADERS
   * -------------------*/
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
  
  // Quando todas as tarefas da engine estiverem prontas,
  // Executa a função passada como parâmetro
  this.pronta = function(funcao){
    this.addEventListener("pronta",function(e){funcao();});
  }
  
  this.criarCena = function(nome)
  {
    var cena = new ATCena3D(nome);
    cenas.push(cena);
    return cena;
  }
  this.removerCena(cena)
  {
    var indice = cenas.indexOf(cena);
    if(indice != -1)
    {
      cenas.splice(indice,1);
      cena.destruir();
    }
  }
  
  var verificarPendencias = function()
  {
    for(var tipo in engine.pendenciasAssincronas)
      if(!engine.pendenciasAssincronas[tipo]) 
	return;
    engine.dispatchEvent(new Event("pronta"));
  }
}