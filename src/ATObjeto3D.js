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
			filhos.setPai(objeto);
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
	
	
  this.carregarOBJ = function(linhas, caminho, key)
  {
    var oldAttrPosicoes = [];
    var oldAttrNormais = [];
    var oldAttrTexturas = [];
    
    var bitsCalculados = false;
    var bitsTexturas;
    var bitsNormais;
    var bitsPosicoes;
    var vertices;
    var proximoI = 0;
    var numLinhas = linhas.length;
    for(key++; key < numLinhas; key++)
    {
      var linha = linhas[key]  +'';
      var partes = linha.split(' ');
      switch(partes[0])
      {
        case "o":
          return key-1;
        break;
        case "v":
          this.oldAttrPosicoes.push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
        break;
        case "vt":
          this.oldAttrTexCoords.push(parseFloat(partes[1]),parseFloat(partes[2]));
        break;
        case "vn":
          this.oldAttrNormais.push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
        break;
        case "f":
          if(!bitsCalculados)
          {
            bitsTexturas = Math.ceil(Math.log2(this.oldAttrTexCoords));
            bitsNormais  = Math.ceil(Math.log2(this.oldAttrNormais));
            bitsPosicoes = Math.ceil(Math.log2(this.oldAttrPosicoes));
            vertices = Array(((1 << bitsPosicoes) << bitsTexturas) << bitsNormais);
            bitsCalculados = true;
          }
          
          var comp = partes.length;
          for(var facei = 1; facei < comp; facei++)
          {
            var face = partes[facei];
            var indicesAttr = face.split('/');
            var iposicao = parseInt(indicesAttr[0])-1;
            var itextura = (indicesAttr[1] == "")?0:parseInt(indicesAttr[1])-1;
            var inormal = (indicesAttr[2] == "")?0:parseInt(indicesAttr[2])-1;
            
            var indice = (((itextura << bitsNormais) + inormal) << bitsPosicoes) + iposicao;
            if(vertices[indice] !== undefined)
            {
              geometria.attrIndices.push(vertices[indice]);
            }
            else
            {
              
              geometria.attrPosicoes.pushArray(this.oldAttrPosicoes.slice(3*iposicao, 3*(iposicao+1)));
              if(bitsNormais) geometria.attrNormais.pushArray(this.oldAttrNormais.slice(3*inormal, 3*(inormal+1)));
              if(bitsTexturas) geometria.attrTexCoords.pushArray(this.oldAttrTexCoords.slice(2*itextura, 2*(itextura+1)));
              geometria.attrIndices.push(proximoI);
              vertices[indice] = proximoI;
              proximoI++;
            }
          }
        break;
      }
    }
    return key;
  }
  this.getNome = function()
  {
    return nome;
  }
}