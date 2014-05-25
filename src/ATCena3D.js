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
  ATCena3D.super_.call(this);
  var objetos = [];
  
  /**
  * Se houver alguma chamada assíncrona, espere-a
  * @method criarObjeto
  * @param {String} nome O nome do objeto
  * @beta
  * @since 0.0.1
  */
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

// 	this.carregarOBJ = function(nome, caminho)
// 	{
//     var cena = this;
//     ATUtils.EventDispatcher.prototype.adicionarPendencia(this.constructor.name, nome);
// 		$.get(caminho, function(data)
// 		{
// 			var linhas = data.split('\n');
// 			var numLinhas = linhas.length;
// 			
// 			for(var key = 0; key < numLinhas; key++)
// 			{
// 				var linha = linhas[key]  +'';
// 				var partes = linha.split(' ');
// 				switch(partes[0])
// 				{
// 					case "o":
// 						if(objeto)
// 						var objeto = new ATObjeto3D(partes[1]);
// 						objetos.push(objeto);
// 						key = objeto.carregarOBJ(linhas, caminho, key);
// 					break;
// 				}
// 			}
// 			ATUtils.EventDispatcher.prototype.removerPendencia(cena.constructor.name, nome);
// 			ATUtils.EventDispatcher.prototype.verificarPendencias();
// 		});
// 	}
}
ATUtils.inherits(ATCena3D, ATObjeto3D);