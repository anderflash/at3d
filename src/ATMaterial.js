/**
* Abstração para materiais. Você pode criar diferentes materiais além do tradicional {{#crossLink "ATMaterialCor"}}{{/crossLink}} e {{#crossLink "ATMaterialTextura"}}{{/crossLink}}.
* @class ATMaterial
* @constructor
* @beta
* @since 0.0.1
*/
function ATMaterial(nome)
{
  
  var ambiente;
  var difusa;
  var especular;
  
  var refracao;
  var transparencia;
  var modeloIluminacao;
  
  var texturaDifusa;
  var texturaAlpha;
  var texturaEspecular;
  var texturaNormal;
  var texturaDeslocamento;

  this.getNome = function()
  {
    return nome;
  }
  this.setAmbiente = function(amb){
    ambiente = amb;
  }
  this.getAmbiente = function(){
    return ambiente;
  }
  this.setDifusa= function(dif){
    difusa = dif;
  }
  this.getDifusa = function(){
    return difusa;
  }
  this.setEspecular= function(esp){
   especular = esp;
  }
  this.getEspecular = function(){
    return especular;
  }
  this.setRefracao = function(ref){
    refracao = ref;
  }
  this.getRefracao = function(){
    return refracao;
  }
  this.setTransparencia = function(trans){
    transparencia = trans;
  }
  this.getTransparencia = function(){
    return transparencia;
  }
  this.setModeloIluminacao= function(illum){
    modeloIluminacao = illum;
  }
  this.getModeloIluminacao= function(){
    return modeloIluminacao;
  }
  this.setTexturaDifusa = function(textura){
    texturaDifusa = textura;
  }
  this.getTexturaDifusa = function(){
    return texturaDifusa;
  }
  this.setTexturaAlfa = function(textura){
    texturaAlpha = textura;
  }
  this.getTexturaAlfa = function(){
    return texturaAlpha;
  }
  this.setTexturaEspecular = function(textura){
    texturaEspecular = textura;
  }
  this.getTexturaEspecular = function(){
    return texturaEspecular;
  }
  this.setTexturaNormal = function(textura){
    texturaNormal = textura;
  }
  this.getTexturaNormal = function(){
    return texturaNormal;
  }
  this.setTexturaDeslocamento = function(textura){
    texturaDeslocamento = textura
  }
  this.getTexturaDeslocamento = function(){
    return texturaDeslocamento;
  }
  
  this.carregarTextura = function(gl, caminho, callback, unit, tipo)
  {
    var imagem = new Image();
    var texture = gl.createTexture();
    texture.unit = unit;
    texture.imagem = imagem;
    texture.caminho = caminho;
    imagem.onload = function()
    {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.activeTexture(gl["TEXTURE"+unit]);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagem);
      if(tipo === gl.LINEAR)
      {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      else if(tipo === gl.NEAREST)
      {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      }
      else if(tipo === gl.LINEAR_MIPMAP_NEAREST)
      {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      callback(texture);
    };
    imagem.src = caminho;
  }
  
}