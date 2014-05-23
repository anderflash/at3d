/**
* Onde coleciona os objetos para exibição.<br>
* Podes criar cenas para diferentes contextos<br>
* Por enquanto os objetos são associados a apenas uma cena
* @class ATCena3D
* @constructor
* @beta
* @since 0.0.1
*/
function ATCena3D()
{
  var objetos = [];
  
  /**
  * Se houver alguma chamada assíncrona, espere-a
  * @private
  * @property pendenciasAssincronas
  * @type {Object}
  * @beta
  * @since 0.0.1
  */
  var pendenciasAssincronas = {};
  
  this.criarObjeto = function(nome)
  {
    var objeto = new ATObjeto3D(nome);
    objetos.push(objeto);
  }
//   this.removerObjeto(objeto)
//   {
//     
//   }
  this.acoplarObjeto = function(objeto)
  {
    if(objeto.cena != null && objeto.cena != this)
    {
      //objeto.cena.desacoplarObjeto(objeto);
      //this.objetos
    }
  }
//   this.desacoplarObjeto = function(objeto)
//   {
//     
//   }

	this.carregarOBJ = function(nome, caminho)
	{
		var objetos = [];
		pendenciasAssincronas[nome] = false;
		$.get(caminho, function(data)
		{
			var linhas = data.split('\n');
			var numLinhas = linhas.length;
			
			for(var key = 0; key < numLinhas; key++)
			{
				var linha = linhas[key]  +'';
				var partes = linha.split(' ');
				switch(partes[0])
				{
					case "o":
						if(objeto)
						var objeto = new ATObjeto3D(partes[1]);
						key = objeto.carregarOBJ(linhas, caminho, key);
					break;
				}
			}
		}
		
		
		
		var objeto = new ATObjeto3D(nome);
		objetos.push[objeto];
		
		objeto.carregarOBJ(caminho, function(objeto)
		{
			pendenciasAssincronas[objeto.getNome()] = true;
			verificarPendencias();
		});
	}
	
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
}
ATUtils.EventDispatcher.prototype.apply( ATCena3D.prototype );