var Jugador = cc.Class.extend({
    contadorVelYCero: 0,
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionCorrer:null,
    animacionSaltar:null,
    estado:null,


ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    this.estado = "p";

    // animaciones - correr
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "playerrunright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionCorrer = new cc.RepeatForever(new cc.Animate(animacion));
    this.animacionCorrer.retain();



    // animaciones - saltar
    var framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "playerjumpright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionSaltar = new cc.RepeatForever(new cc.Animate(animacion));
    this.animacionSaltar.retain();



    // animaciones - quieto
    var framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "playeridleright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionQuieto = new cc.RepeatForever(new cc.Animate(animacion));
    this.animacionQuieto.retain();



    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 5; i++) {
        var str = "playeridleright_0" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));


    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#playeridleright_01.png");
    // Cuerpo dinamico, SI le afectan las fuerzas
    this.body = new cp.Body(5, Infinity );

    this.body.setPos(posicion);
    //body.w_limit = 0.02;
    this.body.setAngle(0);
    this.sprite.setBody(this.body);

    // Se añade el cuerpo al espacio
    this.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

    this.shape.setCollisionType(tipoJugador);

    // forma dinamica
    //this.shape.setFriction(1);
    this.space.addShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);
    layer.addChild(this.sprite,10);


}, moverIzquierda: function(){
    if ( this.estado != "m"){
        this.estado = "m";
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacionCorrer);
    }

    this.sprite.scaleX = -1;
    this.body.applyImpulse(cp.v(-100, 0), cp.v(0, 0));

}, moverDerecha: function(){
    if ( this.estado != "m"){
        this.estado = "m";
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacionCorrer);
    }

    this.sprite.scaleX = 1;
    this.body.applyImpulse(cp.v(100, 0), cp.v(0, 0));

}, moverArriba: function(){
    if ( this.body.vy <= 3 && this.body.vy >= -3 ){
        this.contadorVelYCero  = this.contadorVelYCero +1 ;
        console.log(this.contadorVelYCero);

        if ( this.contadorVelYCero > 2){
            this.contadorVelYCero = 0;
            if ( this.estado != "s"){
                this.estado = "s";
                this.sprite.stopAllActions();
                this.sprite.runAction(this.animacionSaltar);
            }
            this.body.applyImpulse(cp.v(0, 1500), cp.v(0, 0));
        }


    }

}, actualizarAnimacion: function(){


        if ( this.body.vy <= 0.1 && this.body.vy >= -0.1
           && this.body.vx <= 0.1 && this.body.vx >= -0.1 ){

            if ( this.estado != "p"){
                this.estado = "p";
                this.sprite.stopAllActions();
                this.sprite.runAction(this.animacionQuieto);
            }
       }


}











});
