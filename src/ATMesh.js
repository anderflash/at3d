/**
* Objeto3D com vértices e faces
* @class ATMesh
* @constructor
* @beta
* @since 0.0.1
*/
function ATMesh(nome, material, geometria)
{
  ATMesh.super_.call(this);
  if(material == null) material = new ATMaterial("material");
  if(geometria == null) geometria = new ATGeometria("geometria");
  
  /**
  * Define o material
  * @method setMaterial
  * @param {ATMaterial} mat O material
  */ 
	this.setMaterial = function(mat)
  {
    material = mat;
	}
	
	/**
  * Obter o material
  * @method getMaterial
  * @return {ATMaterial} material do mesh
  */ 
	this.getMaterial = function()
  {
    return material;
  }
  
  /**
  * Define o material
  * @method setGeometria
  * @param {ATGeometria} mat O material
  */ 
  this.setGeometria = function(geo)
  {
    geometria = geo;
  }
  /**
  * Define o material
  * @method getGeometria
  * @return {ATGeometria} 
  */
  this.getGeometria = function()
  {
    return geometria;
  }
  
  /**
  * Obtém o nome do mesh
  * @method getNome
  * @return {String} nome 
  */ 
  this.getNome = function()
  {
    return nome;
  }
  
  /**
  * Define o material
  * @method setNome
  * @param {String} nom nome
  */ 
  this.setNome = function(nom)
  {
    nome = nom;
  };
  
  var log2 = function(x) {
    return Math.log(x) / Math.LN2;
  };
  
  /**
  * Carregar OBJ. A cena carrega
  * @method getQtdFilhos
  * @beta
  * @since 0.0.1
  */
  this.carregarOBJ = function(linhas, caminho, key)
  {
    var bitsCalculados = false;
    // TODO: GENERALIZAR (se houver mais atributos no OBJ)
    var listaPosicoesCriada = false;
    var listaNormaisCriada = false;
    var listaCoordTexturasCriada = false;
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
      // TODO: GENERALIZAR (se houver mais atributos no OBJ)
      var antigo = "antigo";
      switch(partes[0])
      {
        case "o":
          return key-1;
        break;
        case "v":
          if(!listaPosicoesCriada)
          {
            geometria.criarLista(ATUtils.atributos.POSICAO+antigo);
            geometria.criarLista(ATUtils.atributos.POSICAO);
            listaPosicoesCriada = true;
          }
          geometria.getLista(ATUtils.atributos.POSICAO+antigo).push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
        break;
        case "vt":
          if(!listaCoordTexturasCriada)
          {
            geometria.criarLista(ATUtils.atributos.COORDTEX+antigo);
            geometria.criarLista(ATUtils.atributos.COORDTEX);
            listaCoordTexturasCriada = true;
          }
          geometria.getLista(ATUtils.atributos.COORDTEX+antigo).push(parseFloat(partes[1]),parseFloat(partes[2]));
        break;
        case "vn":
          if(!listaNormaisCriada)
          {
            geometria.criarLista(ATUtils.atributos.NORMAL+antigo);
            geometria.criarLista(ATUtils.atributos.NORMAL);
            listaNormaisCriada = true;
          }
          geometria.getLista(ATUtils.atributos.NORMAL+antigo).push(parseFloat(partes[1]),parseFloat(partes[2]),parseFloat(partes[3]));
        break;
        case "usemtl":
          this.material = ATMaterialLib.getMaterial(partes[1]);
          break;
        case "f":
          if(!bitsCalculados)
          {
            // TODO: GENERALIZAR (se houver mais atributos no OBJ)
            bitsPosicoes = Math.ceil(log2(geometria.getLista(ATUtils.atributos.POSICAO+antigo).length/3));
            bitsTexturas = Math.ceil(log2(geometria.getLista(ATUtils.atributos.COORDTEX+antigo).length/2));
            bitsNormais  = Math.ceil(log2(geometria.getLista(ATUtils.atributos.NORMAL+antigo).length/3));
            vertices = Array(((1 << bitsPosicoes) << bitsTexturas) << bitsNormais);
            bitsCalculados = true;
            geometria.criarLista(ATUtils.atributos.INDICE);
          }
          
          var comp = partes.length;
          for(var facei = 1; facei < comp; facei++)
          {
            var face = partes[facei];
            var indicesAttr = face.split('/');
            // TODO: GENERALIZAR (se houver mais atributos no OBJ)
            var iposicao = parseInt(indicesAttr[0])-1;
            var itextura = (indicesAttr[1] == "")?0:parseInt(indicesAttr[1])-1;
            var inormal = (indicesAttr[2] == "")?0:parseInt(indicesAttr[2])-1;
            
            var indice = (((itextura << bitsNormais) + inormal) << bitsPosicoes) + iposicao;
            if(vertices[indice] !== undefined)
            {
              geometria.getLista(ATUtils.atributos.INDICE).push(vertices[indice]);
            }
            else
            {
              // TODO: GENERALIZAR (se houver mais atributos no OBJ)
              geometria.getLista(ATUtils.atributos.POSICAO).pushArray(geometria.getLista(ATUtils.atributos.POSICAO+antigo).slice(3*iposicao, 3*(iposicao+1)));
              if(bitsNormais) geometria.getLista(ATUtils.atributos.COORDTEX).pushArray(geometria.getLista(ATUtils.atributos.NORMAL+antigo).slice(3*inormal, 3*(inormal+1)));
              if(bitsTexturas) geometria.getLista(ATUtils.atributos.NORMAL).pushArray(geometria.getLista(ATUtils.atributos.COORDTEX+antigo).slice(2*itextura, 2*(itextura+1)));
              geometria.getLista(ATUtils.atributos.INDICE).push(proximoI);
              vertices[indice] = proximoI;
              proximoI++;
            }
          }
        break;
      }
    }
    return key;
  };
};
ATUtils.inherits(ATMesh, ATObjeto3D);