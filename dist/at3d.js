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
    constructor: ATUtils.EventDispatcher,
    apply: function(object) {
        object.addEventListener = ATUtils.EventDispatcher.prototype.addEventListener;
        object.hasEventListener = ATUtils.EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = ATUtils.EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = ATUtils.EventDispatcher.prototype.dispatchEvent;
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
    var objetos = [];
    this.criarObjeto;
    this.removerObjeto;
    this.acoplarObjeto;
    this.desacoplarObjeto;
    this.desenhar;
    this.criarObjeto = function(nome) {
        var objeto = new ATObjeto3D(nome);
        objetos.push(objeto);
    };
    this.acoplarObjeto = function(objeto) {
        if (objeto.cena != null && objeto.cena != this) {}
    };
}

function ATEngine(nomecanvas) {
    var engine = this;
    var pendenciasAssincronas = {};
    var canvas = document.getElementById(nomecanvas);
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    var cenas = [ new ATCena3D("cena") ];
    var cameras = [ new ATCamera("camera") ];
    var programasShaders = {};
    var verificarPendencias = function() {
        for (var tipo in pendenciasAssincronas) if (!pendenciasAssincronas[tipo]) return;
        this.dispatchEvent({
            type: "pronta"
        });
    };
    this.carregarShaders = function(config) {
        for (var material in config) {
            var programa = new ATShaderProgram(material, gl);
            programasShaders[material] = programa;
            pendenciasAssincronas[programa.getNome()] = false;
            var vShaderNome = config[material][0];
            var fShaderNome = config[material][1];
            var instancia = this;
            programa.carregarShaders(vShaderNome, fShaderNome, function(resultado) {
                pendenciasAssincronas[resultado.programa.getNome()] = true;
                verificarPendencias.apply(instancia, null);
            });
        }
    };
    this.pronta = function(funcao) {
        this.addEventListener("pronta", function() {
            funcao();
        });
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
}

ATUtils.EventDispatcher.prototype.apply(ATEngine.prototype);

function ATEvent() {}

ATEvent.ERRO = "erro";

ATEvent.COMPLETO = "completo";

ATUtils.inherits(ATEvent, Event);

function ATFragmentShader() {}

ATUtils.inherits(ATFragmentShader, ATShader);

function ATGeometry() {}

function ATKeyboard() {}

function ATMaterialCor() {}

ATUtils.inherits(ATMaterialCor, ATMaterial);

function ATMaterial() {}

function ATMaterialTextura() {}

ATUtils.inherits(ATMaterialTextura, ATMaterial);

function ATMouse() {}

function ATObjeto3D() {
    var material = null;
    var geometria = null;
    this.lerOBJ = function(nome) {};
}

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
    constructor: ATUtils.EventDispatcher,
    apply: function(object) {
        object.addEventListener = ATUtils.EventDispatcher.prototype.addEventListener;
        object.hasEventListener = ATUtils.EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = ATUtils.EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = ATUtils.EventDispatcher.prototype.dispatchEvent;
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

function ATVertexShader() {}

ATUtils.inherits(ATVertexShader, ATShader);