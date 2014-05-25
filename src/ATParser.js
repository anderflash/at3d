var ATParser = {};
ATParser._ = {};
ATParser.carregarOBJ = function(nome, caminho, callback)
{
  // Criar um objeto
  var container = new ATObjeto3D(nome);
  container.caminho = caminho;
  
  $.get(caminho, function(data){
    var linhas = data.split('\n');
    var numLinhas = linhas.length;
    
    // Interpretar cada linha
    var key = 0;
    var comando = "";
    var linha, partes;
    while(comando != "mtllib")
    {
      linha = linhas[key]  +'';
      partes = linha.split(' ');
      comando = partes[0];
      key++;
    }
    key--;
    ATMaterialLib.carregarMaterial(partes[1], function()
    {
      for(; key < numLinhas; key++)
      {
        linha = linhas[key]  +'';
        partes = linha.split(' ');
        switch(partes[0])
        {
          case "o": // Criar um mesh filho
            //if(objeto)
            var objeto = new ATMesh(partes[1]);
            var geometria = new ATGeometria();
            var material = new ATMaterial();
            container.adicionarFilho(objeto);
            key = objeto.carregarOBJ(linhas, caminho, key);
            
            // Upload as listas
            if(geometria.existeLista(ATUtils.atributos.POSICAO))
            {
              
            }
          break;
        }
      }
      callback(container);
    });
  });
  return container;
}

ATParser.uploadBuffer()