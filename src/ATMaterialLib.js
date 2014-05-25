var ATMaterialLib = {};
ATMaterialLib.materiais = [];

ATMaterialLib.getMaterial = function(nome)
{
  var num = ATMaterialLib.materiais.length;
  for(var i = 0 ; i < num; i++)
    if(ATMaterialLib.materiais[i].getNome() == nome)
      return ATMaterialLib.materiais[i];
  return null;
}
ATMaterialLib.carregarMaterial = function(caminho, callback)
{
  $.get(caminho, function(dados)
  {
    var linhasMat = dados.split("\n");
    var numLinhasMat = linhasMat.length;
    var material = null;
    var numTexturas = 0;
    
    for(var i = 0; i < numLinhasMat; i++)
    {
      var linhaMat = linhasMat[i];
      var partesMat = linhaMat.split(' ');
      switch(partesMat[0])
      {
        case "newmtl":
          material = new ATMaterial(partesMat[1]);
          ATMaterialLib.materiais.push(material);
        break;
        case "Ns":
        break;
        case "Ka":
          material.setAmbiente([parseFloat(partesMat[1]),
                                parseFloat(partesMat[2]),
                                parseFloat(partesMat[3])]);
        break;
        case "Kd":
          material.setDifusa([parseFloat(partesMat[1]),
                              parseFloat(partesMat[2]),
                              parseFloat(partesMat[3])]);
        break;
        case "Ks":
          material.setEspecular([parseFloat(partesMat[1]),
                                 parseFloat(partesMat[2]),
                                 parseFloat(partesMat[3])]);
        break;
        case "Ni":
          material.setRefracao(parseFloat(partesMat[1]));
        break;
        case "d":
          material.setTransparencia(parseFloat(partesMat[1]));
        break;
        case "illum":
          material.setModeloIluminacao(parseInt(partesMat[1]));
        break;
        case "map_Kd":
          // Transformar em um mapa de textura
          ATUtils.EventDispatcher.prototype.adicionarPendencia("ATMaterialLib", partesMat[1]);
          material.carregarTextura(ATMaterialLib.gl, partesMat[1], function(textura){
            ATUtils.EventDispatcher.prototype.removerPendencia("ATMaterialLib", textura.caminho);
            material.setTexturaDifusa(textura);
            ATUtils.EventDispatcher.prototype.verificarPendencias("ATMaterialLib");
          },numTexturas,ATMaterialLib.gl.LINEAR_MIPMAP_NEAREST);
          numTexturas++;
        break;
      }
    }
    var retorno = function()
    {
      ATUtils.EventDispatcher.prototype.removeEventListener("ATMaterialLibpronta", retorno);
      callback();
    };
    ATUtils.EventDispatcher.prototype.addEventListener("ATMaterialLibpronta",retorno);
    ATUtils.EventDispatcher.prototype.verificarPendencias("ATMaterialLib");
  })
};