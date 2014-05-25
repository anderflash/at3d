var ATUtils = {};

ATUtils.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

ATUtils.EventDispatcher = function() {};

ATUtils.EventDispatcher.prototype = {
    pendenciasAssincronas: {},
    constructor: ATUtils.EventDispatcher,
    apply: function(object) {
        object.addEventListener = ATUtils.EventDispatcher.prototype.addEventListener;
        object.hasEventListener = ATUtils.EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = ATUtils.EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = ATUtils.EventDispatcher.prototype.dispatchEvent;
    },
    adicionarPendencia: function(nome, objeto) {
        if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
        ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = false;
    },
    removerPendencia: function(nome, objeto) {
        if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
        ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = true;
    },
    verificarPendencias: function(nome) {
        if (ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) {
            for (var tipo in ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome]) if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][tipo]) return;
        }
        ATUtils.EventDispatcher.prototype.dispatchEvent({
            type: nome + "pronta"
        });
    },
    addEventListener: function(type, listener) {
        if (this._listeners === undefined) this._listeners = {};
        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    },
    hasEventListener: function(type, listener) {
        if (this._listeners === undefined) return false;
        var listeners = this._listeners;
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    },
    removeEventListener: function(type, listener) {
        if (this._listeners === undefined) return;
        var listeners = this._listeners;
        var listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    },
    dispatchEvent: function(event) {
        if (this._listeners === undefined) return;
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            var array = [];
            var length = listenerArray.length;
            for (var i = 0; i < length; i++) {
                array[i] = listenerArray[i];
            }
            for (var i = 0; i < length; i++) {
                array[i].call(this, event);
            }
        }
    }
};

Array.prototype.pushArray = function() {
    var toPush = this.concat.apply([], arguments);
    for (var i = 0, len = toPush.length; i < len; ++i) {
        this.push(toPush[i]);
    }
};

function ATCamera(nome) {
    var vMatrix = mat4.create();
    var pMatrix = mat4.create();
    this.lookAt = function(posicao, direcao, cima) {
        mat4.lookAt(vMatrix, posicao, direcao, cima);
    };
    this.getMatrizVisualizacao = function() {
        return vMatrix;
    };
    this.getMatrizProjecao = function() {
        return pMatrix;
    };
    this.getNome = function() {
        return nome;
    };
}

function ATCena3D() {
    ATCena3D.super_.call(this);
    var objetos = [];
    this.criarObjeto = function(nome) {
        var objeto = new ATObjeto3D(nome);
        objetos.push(objeto);
    };
    this.acoplarObjeto = function(objeto) {
        if (objeto.cena != null && objeto.cena != this) {}
    };
}

ATUtils.inherits(ATCena3D, ATObjeto3D);

function ATEngine(nomecanvas) {
    var engine = this;
    var canvas = document.getElementById(nomecanvas);
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    ATMaterialLib.gl = gl;
    gl.clearColor(0, 0, .3, 1);
    var cenas = [ new ATCena3D("cena") ];
    var cameras = [ new ATCamera("camera") ];
    var programasShaders = {};
    this.getCena = function(nome) {
        if (nome === null || nome === undefined) return cenas[0];
        if (typeof nome === "string") {
            var num = cenas.length;
            for (var i = 0; i < num; i++) if (cenas[i].getNome() == nome) return cenas[i];
            return null;
        } else return cenas[nome];
    };
    this.getCamera = function(nome) {
        if (nome === null || nome === undefined) return cameras[0];
        if (typeof nome === "string") {
            var num = cameras.length;
            for (var i = 0; i < num; i++) if (cameras[i].getNome() == nome) return cameras[i];
            return null;
        } else return cameras[nome];
    };
    this.carregarShaders = function(config) {
        for (var material in config) {
            var programa = new ATShaderProgram(material, gl);
            programasShaders[material] = programa;
            ATUtils.EventDispatcher.prototype.adicionarPendencia(this.constructor.name, programa.getNome());
            var vShaderNome = config[material][0];
            var fShaderNome = config[material][1];
            var instancia = this;
            programa.carregarShaders(vShaderNome, fShaderNome, function(resultado) {
                ATUtils.EventDispatcher.prototype.removerPendencia(instancia.constructor.name, resultado.programa.getNome());
                ATUtils.EventDispatcher.prototype.verificarPendencias(instancia.constructor.name);
            });
        }
    };
    this.carregarOBJ = function(nome, caminho) {
        var cena = this;
        ATUtils.EventDispatcher.prototype.adicionarPendencia(this.constructor.name, caminho);
        var objeto = ATParser.carregarOBJ(nome, caminho, function(objeto) {
            ATUtils.EventDispatcher.prototype.removerPendencia(cena.constructor.name, objeto.caminho);
            ATUtils.EventDispatcher.prototype.verificarPendencias(cena.constructor.name);
        });
        return objeto;
    };
    this.pronta = function(funcao) {
        var funcao2 = function() {
            ATUtils.EventDispatcher.prototype.removeEventListener(this.constructor.name + "pronta", funcao2);
            funcao();
        };
        ATUtils.EventDispatcher.prototype.addEventListener(this.constructor.name + "pronta", funcao2);
    };
    this.criarCena = function(nome) {
        var cena = new ATCena3D(nome);
        cenas.push(cena);
        return cena;
    };
    this.criarCamera = function(nome) {
        var camera = new ATCamera(nome);
        cameras.push(camera);
        return camera;
    };
    this.removerCena = function(cena) {
        var indice = cenas.indexOf(cena);
        if (indice != -1) {
            cenas.splice(indice, 1);
            cena.destruir();
        }
    };
    this.fullScreen = function(habilitado) {};
    this.desenhar = function(cena, camera) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var i = 0; i < cena.getQtdFilhos(); i++) {
            var filho = cena.getFilho(i);
        }
        gl.uniformMatrix4fv();
    };
}

function ATEvent() {}

ATEvent.ERRO = "erro";

ATEvent.COMPLETO = "completo";

ATUtils.inherits(ATEvent, Event);

function ATFragmentShader() {
    ATFragmentShader.super_.call(this);
}

ATUtils.inherits(ATFragmentShader, ATShader);

function ATGeometria(nome) {
    var listaCores = [];
    var listaPosicoes = [];
    var listaNormais = [];
    var listaCoordTexturas = [];
    var listaIndexadaCores = [];
    var listaIndexadaPosicoes = [];
    var listaIndexadaNormais = [];
    var listaIndexadaCoordTexturas = [];
    var listaIndices = [];
    var bufferPosicoes = null;
    var bufferCoordTextura = null;
    var bufferNormais = null;
    var bufferCores = null;
    var bufferIndices = null;
    this.getListaCores = function() {
        return listaCores;
    };
    this.getListaPosicoes = function() {
        return listaPosicoes;
    };
    this.getListaCoordTexturas = function() {
        return listaCoordTexturas;
    };
    this.getListaNormais = function() {
        return listaNormais;
    };
    this.getListaIndices = function() {
        return listaIndices;
    };
    this.getListaIndexadaCores = function() {
        return listaIndexadaCores;
    };
    this.getListaIndexadaCoordTexturas = function() {
        return listaIndexadaCoordTexturas;
    };
    this.getListaIndexadaPosicoes = function() {
        return listaIndexadaPosicoes;
    };
    this.getListaIndexadaNormais = function() {
        return listaIndexadaNormais;
    };
    this.limparListaCores = function() {
        listaCores = [];
    };
    this.limparListaPosicoes = function() {
        listaPosicoes = [];
    };
    this.limparListaCoordTexturas = function() {
        listaCoordTexturas = [];
    };
    this.limparListaNormais = function() {
        listaNormais = [];
    };
    this.limparListaIndices = function() {
        listaIndices = [];
    };
    this.limparListaIndexadaCores = function() {
        listaIndexadaCores = [];
    };
    this.limparListaIndexadaPosicoes = function() {
        listaIndexadaPosicoes = [];
    };
    this.limparListaIndexadaCoordTexturas = function() {
        listaIndexadaCoordTexturas = [];
    };
    this.limparListaIndexadaNormais = function() {
        listaIndexadaNormais = [];
    };
}

function ATKeyboard() {}

function ATMaterialCor() {}

ATUtils.inherits(ATMaterialCor, ATMaterial);

function ATMaterial(nome) {
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
    this.getNome = function() {
        return nome;
    };
    this.setAmbiente = function(amb) {
        ambiente = amb;
    };
    this.getAmbiente = function() {
        return ambiente;
    };
    this.setDifusa = function(dif) {
        difusa = dif;
    };
    this.getDifusa = function() {
        return difusa;
    };
    this.setEspecular = function(esp) {
        especular = esp;
    };
    this.getEspecular = function() {
        return especular;
    };
    this.setRefracao = function(ref) {
        refracao = ref;
    };
    this.getRefracao = function() {
        return refracao;
    };
    this.setTransparencia = function(trans) {
        transparencia = trans;
    };
    this.getTransparencia = function() {
        return transparencia;
    };
    this.setModeloIluminacao = function(illum) {
        modeloIluminacao = illum;
    };
    this.getModeloIluminacao = function() {
        return modeloIluminacao;
    };
    this.setTexturaDifusa = function(textura) {
        texturaDifusa = textura;
    };
    this.getTexturaDifusa = function() {
        return texturaDifusa;
    };
    this.setTexturaAlfa = function(textura) {
        texturaAlpha = textura;
    };
    this.getTexturaAlfa = function() {
        return texturaAlpha;
    };
    this.setTexturaEspecular = function(textura) {
        texturaEspecular = textura;
    };
    this.getTexturaEspecular = function() {
        return texturaEspecular;
    };
    this.setTexturaNormal = function(textura) {
        texturaNormal = textura;
    };
    this.getTexturaNormal = function() {
        return texturaNormal;
    };
    this.setTexturaDeslocamento = function(textura) {
        texturaDeslocamento = textura;
    };
    this.getTexturaDeslocamento = function() {
        return texturaDeslocamento;
    };
    this.carregarTextura = function(gl, caminho, callback, unit, tipo) {
        var imagem = new Image();
        var texture = gl.createTexture();
        texture.unit = unit;
        texture.imagem = imagem;
        texture.caminho = caminho;
        imagem.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl["TEXTURE" + unit]);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagem);
            if (tipo === gl.LINEAR) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            } else if (tipo === gl.NEAREST) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            } else if (tipo === gl.LINEAR_MIPMAP_NEAREST) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.bindTexture(gl.TEXTURE_2D, null);
            callback(texture);
        };
        imagem.src = caminho;
    };
}

var ATMaterialLib = {};

ATMaterialLib.materiais = [];

ATMaterialLib.getMaterial = function(nome) {
    var num = ATMaterialLib.materiais.length;
    for (var i = 0; i < num; i++) if (ATMaterialLib.materiais[i].getNome() == nome) return ATMaterialLib.materiais[i];
    return null;
};

ATMaterialLib.carregarMaterial = function(caminho, callback) {
    $.get(caminho, function(dados) {
        var linhasMat = dados.split("\n");
        var numLinhasMat = linhasMat.length;
        var material = null;
        var numTexturas = 0;
        for (var i = 0; i < numLinhasMat; i++) {
            var linhaMat = linhasMat[i];
            var partesMat = linhaMat.split(" ");
            switch (partesMat[0]) {
              case "newmtl":
                material = new ATMaterial(partesMat[1]);
                ATMaterialLib.materiais.push(material);
                break;

              case "Ns":
                break;

              case "Ka":
                material.setAmbiente([ parseFloat(partesMat[1]), parseFloat(partesMat[2]), parseFloat(partesMat[3]) ]);
                break;

              case "Kd":
                material.setDifusa([ parseFloat(partesMat[1]), parseFloat(partesMat[2]), parseFloat(partesMat[3]) ]);
                break;

              case "Ks":
                material.setEspecular([ parseFloat(partesMat[1]), parseFloat(partesMat[2]), parseFloat(partesMat[3]) ]);
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
                ATUtils.EventDispatcher.prototype.adicionarPendencia("ATMaterialLib", partesMat[1]);
                material.carregarTextura(ATMaterialLib.gl, partesMat[1], function(textura) {
                    ATUtils.EventDispatcher.prototype.removerPendencia("ATMaterialLib", textura.caminho);
                    material.setTexturaDifusa(textura);
                    ATUtils.EventDispatcher.prototype.verificarPendencias("ATMaterialLib");
                }, numTexturas, ATMaterialLib.gl.LINEAR_MIPMAP_NEAREST);
                numTexturas++;
                break;
            }
        }
        var retorno = function() {
            ATUtils.EventDispatcher.prototype.removeEventListener("ATMaterialLibpronta", retorno);
            callback();
        };
        ATUtils.EventDispatcher.prototype.addEventListener("ATMaterialLibpronta", retorno);
        ATUtils.EventDispatcher.prototype.verificarPendencias("ATMaterialLib");
    });
};

function ATMaterialTextura() {}

ATUtils.inherits(ATMaterialTextura, ATMaterial);

function ATMesh(nome, material, geometria) {
    ATMesh.super_.call(this);
    if (material == null) material = new ATMaterial("material");
    if (geometria == null) geometria = new ATGeometria("geometria");
    this.setMaterial = function(mat) {
        material = mat;
    };
    this.getMaterial = function() {
        return material;
    };
    this.setGeometria = function(geo) {
        geometria = geo;
    };
    this.getGeometria = function() {
        return geometria;
    };
    this.getNome = function() {
        return nome;
    };
    this.setNome = function(nom) {
        nome = nom;
    };
    var log2 = function(x) {
        return Math.log(x) / Math.LN2;
    };
    this.carregarOBJ = function(linhas, caminho, key) {
        var bitsCalculados = false;
        var bitsTexturas;
        var bitsNormais;
        var bitsPosicoes;
        var vertices;
        var proximoI = 0;
        var numLinhas = linhas.length;
        for (key++; key < numLinhas; key++) {
            var linha = linhas[key] + "";
            var partes = linha.split(" ");
            switch (partes[0]) {
              case "o":
                return key - 1;
                break;

              case "v":
                geometria.getListaPosicoes().push(parseFloat(partes[1]), parseFloat(partes[2]), parseFloat(partes[3]));
                break;

              case "vt":
                geometria.getListaCoordTexturas().push(parseFloat(partes[1]), parseFloat(partes[2]));
                break;

              case "vn":
                geometria.getListaNormais().push(parseFloat(partes[1]), parseFloat(partes[2]), parseFloat(partes[3]));
                break;

              case "usemtl":
                this.material = ATMaterialLib.getMaterial(partes[1]);
                break;

              case "f":
                if (!bitsCalculados) {
                    bitsTexturas = Math.ceil(log2(geometria.getListaCoordTexturas().length / 2));
                    bitsNormais = Math.ceil(log2(geometria.getListaNormais().length / 3));
                    bitsPosicoes = Math.ceil(log2(geometria.getListaPosicoes().length / 3));
                    vertices = Array(1 << bitsPosicoes << bitsTexturas << bitsNormais);
                    bitsCalculados = true;
                }
                var comp = partes.length;
                for (var facei = 1; facei < comp; facei++) {
                    var face = partes[facei];
                    var indicesAttr = face.split("/");
                    var iposicao = parseInt(indicesAttr[0]) - 1;
                    var itextura = indicesAttr[1] == "" ? 0 : parseInt(indicesAttr[1]) - 1;
                    var inormal = indicesAttr[2] == "" ? 0 : parseInt(indicesAttr[2]) - 1;
                    var indice = ((itextura << bitsNormais) + inormal << bitsPosicoes) + iposicao;
                    if (vertices[indice] !== undefined) {
                        geometria.getListaIndices().push(vertices[indice]);
                    } else {
                        geometria.getListaIndexadaPosicoes().pushArray(geometria.getListaPosicoes().slice(3 * iposicao, 3 * (iposicao + 1)));
                        if (bitsNormais) geometria.getListaIndexadaNormais().pushArray(geometria.getListaNormais().slice(3 * inormal, 3 * (inormal + 1)));
                        if (bitsTexturas) geometria.getListaIndexadaCoordTexturas().pushArray(geometria.getListaCoordTexturas().slice(2 * itextura, 2 * (itextura + 1)));
                        geometria.getListaIndices().push(proximoI);
                        vertices[indice] = proximoI;
                        proximoI++;
                    }
                }
                break;
            }
        }
        return key;
    };
}

ATUtils.inherits(ATMesh, ATObjeto3D);

function ATMouse() {}

function ATObjeto3D(nome) {
    var filhos = [];
    var pai = null;
    this.adicionarFilho = function(objeto) {
        if (filhos.indexOf(objeto) == -1) {
            filhos.push(objeto);
            objeto.setPai(this);
        }
    };
    this.removerFilho = function(objeto) {
        var indice = filhos.indexOf(objeto);
        if (indice != -1) filhos.splice(indice, 1);
    };
    this.getPai = function() {
        return pai;
    };
    this.setPai = function(objeto) {
        pai = objeto;
    };
    this.visible = true;
    this.getFilho = function(indice) {
        if (i < filhos.length && i >= 0) return filhos[i]; else return null;
    };
    this.getQtdFilhos = function() {
        return filhos.length;
    };
    this.getNome = function() {
        return nome;
    };
}

var ATParser = {};

ATParser._ = {};

ATParser.carregarOBJ = function(nome, caminho, callback) {
    var container = new ATObjeto3D(nome);
    container.caminho = caminho;
    $.get(caminho, function(data) {
        var linhas = data.split("\n");
        var numLinhas = linhas.length;
        var key = 0;
        var comando = "";
        var linha, partes;
        while (comando != "mtllib") {
            linha = linhas[key] + "";
            partes = linha.split(" ");
            comando = partes[0];
            key++;
        }
        key--;
        ATMaterialLib.carregarMaterial(partes[1], function() {
            for (;key < numLinhas; key++) {
                linha = linhas[key] + "";
                partes = linha.split(" ");
                switch (partes[0]) {
                  case "o":
                    var objeto = new ATMesh(partes[1]);
                    var geometria = new ATGeometria();
                    var material = new ATMaterial();
                    container.adicionarFilho(objeto);
                    key = objeto.carregarOBJ(linhas, caminho, key);
                    break;
                }
            }
            callback(container);
        });
    });
    return container;
};

function ATShader(caminho) {
    this.caminho = caminho;
}

function ATShaderProgram(nome, gl) {
    var vShader;
    var fShader;
    var atributos = {};
    var uniforms = {};
    var codigos = [];
    var FLOAT = 1;
    var VEC2 = 2;
    var VEC3 = 3;
    var VEC4 = 4;
    var MAT3 = 5;
    var MAT4 = 6;
    var SAMPLER2D = 6;
    var programa;
    var instancia = this;
    var getShader = function(shaderNome, tipo, callback) {
        var shader = gl.createShader(tipo);
        $.get(shaderNome, function(dados) {
            gl.shaderSource(shader, dados);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw "Não pode compilar shader do tipo " + tipo + " :\n\n" + gl.getShaderInfoLog(shader);
            codigos.push(dados);
            shader.codigo = dados;
            shader.nome = shaderNome;
            callback();
        });
        return shader;
    };
    this.carregarShaders = function(vShaderNome, fShaderNome, callback) {
        var vShaderCarregado = false;
        var fShaderCarregado = false;
        vShader = getShader(vShaderNome, gl.VERTEX_SHADER, function() {
            if (fShaderCarregado) {
                console.log(vShaderNome + "," + fShaderNome);
                carregarPrograma();
            } else vShaderCarregado = true;
        });
        fShader = getShader(fShaderNome, gl.FRAGMENT_SHADER, function() {
            if (vShaderCarregado) {
                console.log(vShaderNome + "," + fShaderNome);
                carregarPrograma();
            } else fShaderCarregado = true;
        });
        var carregarPrograma = function() {
            programa = gl.createProgram();
            gl.attachShader(programa, vShader);
            gl.attachShader(programa, fShader);
            gl.linkProgram(programa);
            if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
                throw "Não pode compilar programa :\n\n" + gl.getProgramInfoLog(programa);
            }
            for (var k = 0; k < codigos.length; k++) {
                var linhas = codigos[k].split("\n");
                var numLinhas = linhas.length;
                for (var i = 0; i < numLinhas; i++) {
                    if (linhas[i].length > 0) {
                        var partes = linhas[i].split(" ");
                        if (partes[0] == "void") break;
                        var variavel = partes[2].replace(";", "");
                        switch (partes[0]) {
                          case "attribute":
                            atributos[variavel] = [ gl.getAttribLocation(programa, variavel), parseInt(partes[1].substr(3, 1)) ];
                            break;

                          case "uniform":
                            uniforms[variavel] = [ gl.getUniformLocation(programa, variavel) ];
                            switch (partes[1]) {
                              case "float":
                                uniforms[variavel].push(FLOAT);
                                break;

                              case "mat3":
                                uniforms[variavel].push(MAT3);
                                break;

                              case "mat4":
                                uniforms[variavel].push(MAT4);
                                break;

                              case "vec2":
                                uniforms[variavel].push(VEC2);
                                break;

                              case "vec3":
                                uniforms[variavel].push(VEC3);
                                break;

                              case "vec4":
                                uniforms[variavel].push(VEC4);
                                break;

                              case "sampler2D":
                                uniforms[variavel].push(SAMPLER2D);
                                break;
                            }
                            break;
                        }
                    }
                }
            }
            callback({
                programa: instancia
            });
        };
    };
    this.usar = function() {};
    this.getNome = function() {
        return nome;
    };
}

function ATTrackball() {}

var ATUtils = {};

ATUtils.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

ATUtils.EventDispatcher = function() {};

ATUtils.EventDispatcher.prototype = {
    pendenciasAssincronas: {},
    constructor: ATUtils.EventDispatcher,
    apply: function(object) {
        object.addEventListener = ATUtils.EventDispatcher.prototype.addEventListener;
        object.hasEventListener = ATUtils.EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = ATUtils.EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = ATUtils.EventDispatcher.prototype.dispatchEvent;
    },
    adicionarPendencia: function(nome, objeto) {
        if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
        ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = false;
    },
    removerPendencia: function(nome, objeto) {
        if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome] = {};
        ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][objeto] = true;
    },
    verificarPendencias: function(nome) {
        if (ATUtils.EventDispatcher.prototype.pendenciasAssincronas.hasOwnProperty(nome)) {
            for (var tipo in ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome]) if (!ATUtils.EventDispatcher.prototype.pendenciasAssincronas[nome][tipo]) return;
        }
        ATUtils.EventDispatcher.prototype.dispatchEvent({
            type: nome + "pronta"
        });
    },
    addEventListener: function(type, listener) {
        if (this._listeners === undefined) this._listeners = {};
        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    },
    hasEventListener: function(type, listener) {
        if (this._listeners === undefined) return false;
        var listeners = this._listeners;
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    },
    removeEventListener: function(type, listener) {
        if (this._listeners === undefined) return;
        var listeners = this._listeners;
        var listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    },
    dispatchEvent: function(event) {
        if (this._listeners === undefined) return;
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            var array = [];
            var length = listenerArray.length;
            for (var i = 0; i < length; i++) {
                array[i] = listenerArray[i];
            }
            for (var i = 0; i < length; i++) {
                array[i].call(this, event);
            }
        }
    }
};

Array.prototype.pushArray = function() {
    var toPush = this.concat.apply([], arguments);
    for (var i = 0, len = toPush.length; i < len; ++i) {
        this.push(toPush[i]);
    }
};

function ATVertexShader() {
    ATVertexShader.super_.call(this);
}

ATUtils.inherits(ATVertexShader, ATShader);