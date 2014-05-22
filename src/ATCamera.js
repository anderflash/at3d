/**
* Representação da Câmera em uma cena
* @class ATCamera
* @constructor
* @beta
* @since 0.0.1
*/
function ATCamera(nome)
{
	/**
  * Matriz de Visualização
  * @property vMatrix
  * @private
  * @beta
  * @since 0.0.1
  */
  var vMatrix = mat4.create();
	
	/**
  * Matriz de Projeção
  * @property pMatrix
  * @private
  * @beta
  * @since 0.0.1
  */
  var pMatrix = mat4.create();
  
  /**
  * Posicionar e orientar a câmera
  * Parâmetros intrísecos
  * @method lookAt
  * @beta
  * @since 0.0.1
  */
  this.lookAt = function(posicao, direcao, cima)
  {
    mat4.lookAt(vMatrix, posicao, direcao, cima);
  }
  
  /**
  * Obter a matrix de visualização (vide padrão MVP)
  * Parâmetros intrísecos
  * @method getMatrizVisualizacao
  * @beta
  * @return {Array} Retorna a matrix de visualização 4x4
  * @since 0.0.1
  */
  this.getMatrizVisualizacao = function()
  {
    return vMatrix;
  }
  
  /**
  * Obter a matrix de projeção (vide padrão MVP)
  * Parâmetros intrísecos
  * @method getMatrizProjecao
  * @beta
  * @return {Array} Retorna a matrix de visualização 4x4
  * @since 0.0.1
  */
  this.getMatrizProjecao = function(){
		return pMatrix;
	}
	
	/**
  * Obter a matrix de projeção (vide padrão MVP)
  * Parâmetros intrísecos
  * @method getMatrizProjecao
  * @beta
  * @return {Array} Retorna a matrix de visualização 4x4
  * @since 0.0.1
  */
	this.getNome = function(){
		return nome
	};
}