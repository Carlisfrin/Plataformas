
var tipoJugador = 1;
var tipoMoneda = 2;
var tipoEnemigo = 3;
var tipoDisparo = 5;
var tipoSuelo = 6;



var GameLayer = cc.Layer.extend({
    tiempoDisparo:0,
    enemigos:[],
    monedas:[],
    disparos:[],
    formasEliminar:[],
    teclaIzquierda:false,
    teclaDerecha:false,
    teclaArriba:false,
    teclaBarra:false,
    space:null,
    jugador:null,
    mapa: null,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.disparo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerrunright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerjumpright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playeridleright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerdieright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playershootright_plist);


       // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.colisionJugadorConMoneda.bind(this), null, null);

        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, this.colisionDisparoConEnemigo.bind(this), null, null);


        this.space.addCollisionHandler(tipoDisparo, tipoSuelo,
            null, this.colisionDisparoConSuelo.bind(this), null, null);

        this.jugador = new Jugador(this.space,
               cc.p(50,250), this);


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada

        }, this);



        this.scheduleUpdate();
        this.cargarMapa();
       return true;

    },colisionJugadorConMoneda: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);

    },colisionDisparoConEnemigo:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);
        this.formasEliminar.push(shapes[1]);

    },colisionDisparoConSuelo:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[0]);

    },teclaLevantada: function(keyCode, event){

         var instancia = event.getCurrentTarget();
         // Flecha izquierda
         if( keyCode == 37){
             instancia.teclaIzquierda = false;

         }
         // Flecha derecha
         if( keyCode == 39){
             instancia.teclaDerecha = false;
         }
         // Flecha arriba
         if( keyCode == 38){
             instancia.teclaArriba = false;
         }
         // Barra espaciadora
         if( keyCode == 32){
            instancia.teclaBarra = false;
         }
    },teclaPulsada: function(keyCode, event){

         var instancia = event.getCurrentTarget();
         // Flecha izquierda
         if( keyCode == 37){
             instancia.teclaIzquierda = true;

         }
         // Flecha derecha
         if( keyCode == 39){
             instancia.teclaDerecha = true;
         }
         // Flecha arriba
         if( keyCode == 38){
             instancia.teclaArriba = true;
         }
         // Barra espaciadora
         if( keyCode == 32){
            instancia.teclaBarra = true;
         }


    },
    update:function (dt) {
        this.space.step(dt);

        if ( this.tiempoDisparo > 0){
            this.tiempoDisparo = this.tiempoDisparo - 1;
        }

        if ( this.teclaBarra == true && this.tiempoDisparo <= 0){
            this.tiempoDisparo = 60;
            var disparo = new Disparo(this.space,
                cc.p(this.jugador.body.p.x,this.jugador.body.p.y ),
                this);
            this.disparos.push(disparo);
        }

       for(var i = 0; i < this.enemigos.length; i++) {
          var enemigo = this.enemigos[i];
          enemigo.moverAutomaticamente();
      }




     // Eliminar formas:
      for(var i = 0; i < this.formasEliminar.length; i++) {
        var shape = this.formasEliminar[i];

        for (var r = 0; r < this.monedas.length; r++) {
            if (this.monedas[r].shape == shape) {
                this.monedas[r].eliminar();
                this.monedas.splice(r, 1);
            }
        }

        for (var r = 0; r < this.enemigos.length; r++) {
            if (this.enemigos[r].shape == shape) {
                this.enemigos[r].eliminar();
                this.enemigos.splice(r, 1);
            }
        }

        for (var r = 0; r < this.disparos.length; r++) {
            if (this.disparos[r].shape == shape) {
                this.disparos[r].eliminar();
                this.disparos.splice(r, 1);
            }
        }

      }
      this.formasEliminar = [];




         if ( this.teclaArriba == true ){
            this.jugador.moverArriba();
         }
         if (this.teclaIzquierda  == true){
            this.jugador.moverIzquierda();
         }
         if( this.teclaDerecha == true ){
            this.jugador.moverDerecha();
         }
          if ( this.teclaIzquierda == false &&  this.teclaIzquierda == false
             && this.teclaDerecha == false){

             this.jugador.body.vx = 0;
          }






        this.jugador.actualizarAnimacion();

        // actualizar camara (posición de la capa).
        var posicionXCamara = this.jugador.body.p.x - 200;
        var posicionYCamara = this.jugador.body.p.y - 200;

        if ( posicionXCamara < 0 ){
           posicionXCamara = 0;
        }
        if ( posicionYCamara < 0 ){
           posicionYCamara = 0;
        }



        this.setPosition(cc.p( - posicionXCamara, -posicionYCamara));



         if (this.jugador.body.vx < -200){
              this.jugador.body.vx = -200;
         }

         if (this.jugador.body.vx > 200){
             this.jugador.body.vx = 200;
         }




    }, cargarMapa: function(){
             this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
             this.addChild(this.mapa);

             // Procesamiento de objetos
           // Solicitar los objeto dentro de la capa Suelos
           var grupoSuelos = this.mapa.getObjectGroup("Suelos");
           var suelosArray = grupoSuelos.getObjects();

           // Los objetos de la capa suelos se transforman a
           // formas estáticas de Chipmunk ( SegmentShape ).
           for (var i = 0; i < suelosArray.length; i++) {
               var suelo = suelosArray[i];
               var puntos = suelo.polylinePoints;
               for(var j = 0; j < puntos.length - 1; j++){
                   var bodySuelo = new cp.StaticBody();

                   var shapeSuelo = new cp.SegmentShape(bodySuelo,
                       cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                           parseInt(suelo.y) - parseInt(puntos[j].y)),
                       cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                           parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                       3);
                   //shapeSuelo.setFriction(1);
                   shapeSuelo.setCollisionType(tipoSuelo);
                   this.space.addStaticShape(shapeSuelo);
               }
           }



        var grupoMonedas = this.mapa.getObjectGroup("Monedas");
        var monedasArray = grupoMonedas.getObjects();
        for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this.space,
                cc.p(monedasArray[i]["x"],monedasArray[i]["y"]),
                this);

            this.monedas.push(moneda);

        }

        var grupoEnemigos = this.mapa.getObjectGroup("Enemigos");
        var enemigosArray = grupoEnemigos.getObjects();
        for (var i = 0; i < enemigosArray.length; i++) {
            var enemigo = new Enemigo(this.space,
                cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]),
                this);

            this.enemigos.push(enemigo);
        }



    }



});



var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});
