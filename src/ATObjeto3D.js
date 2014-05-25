/**
* Objeto consistindo do material (cor, textura...) 
* e sua geometria (com posições, normais...)
* @class ATObjeto3D
* @constructor
* @beta
* @since 0.0.1
*/
function ATObjeto3D(nome)
{
  var filhos = [];
	var pai = null;
	
	/**
	* Adicionar um objeto filho (se não estiver adicionado)
	* @method adicionarFilho
	* @beta
	* @since 0.0.1
	*/
	this.adicionarFilho = function(objeto)
	{
		if(filhos.indexOf(objeto) == -1)
		{
			filhos.push(objeto);
			objeto.setPai(this);
		}
	}
	
	/**
	* Remover um objeto (se for um filho)
	* @method removerFilho
	* @param {ATObjeto3D} objeto
	* @beta
	* @since 0.0.1
	*/
	this.removerFilho = function(objeto)
	{
		var indice = filhos.indexOf(objeto);
		if(indice != -1)
			filhos.splice(indice,1);
	}
	/**
	* Obter o ATObjeto3D pai.
	* @method getPai
	* @param {ATObjeto3D} objeto
	* @beta
	* @since 0.0.1
	*/
	this.getPai = function()
	{
		return pai;
	}
	/**
	* Remover um objeto (se for um filho)
	* @method setPai
	* @param {ATObjeto3D} objeto
	* @beta
	* @since 0.0.1
	*/
	this.setPai = function(objeto)
	{
		pai = objeto;
	}
	
	/**
	* Está ou não visível?
	* Usado na renderização
	* @property visible
	* @type {Boolean}
	* @beta
	* @since 0.0.1
	*/
	this.visible = true;
	
	/**
	* Obter o i-ésimo filho
	* Usado na renderização
	* @method getFilho
	* @param {Number} o índice do filho
	* @beta
	* @since 0.0.1
	*/
	this.getFilho = function(indice)
	{
		if(i < filhos.length && i >= 0)
			return filhos[i];
		else
			return null;
	}
	
	/**
	* Obter o número total de filhos
	* @method getQtdFilhos
	* @beta
	* @since 0.0.1
	*/
	this.getQtdFilhos = function()
	{
		return filhos.length;
	}
	  
  /**
  * Obter o número total de filhos
  * @method getQtdFilhos
  * @beta
  * @since 0.0.1
  */
  this.getNome = function()
  {
    return nome;
  }
}