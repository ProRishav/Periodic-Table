class Overlay{
    constructor(divElement){
        this.overlayDiv = divElement;
    }

    cast(){
        this.overlayDiv.height = '100vh';
        this.overlayDiv.heightwidth = '100%';
        this.overlayDiv.position = 'absolute';
        this.overlayDiv.zIndex = '-1';
        this.overlayDiv.background = 'rgba(74, 74, 74, 0)';
        this.overlayDiv.backdropFilter = 'blur(0px)';
        this.overlayDiv.transition = "background 10ms ease, backdrop-filter .4s ease";
    }

    onClick(func){
        this.overlayDiv.transition = "all .1s ease";
        this.overlayDiv.addEventListener('click', ()=>{
            this.pushDown();
            func();
        });
    }
    
    pushUp(){
        this.overlayDiv.style.zIndex = 100;
        this.overlayDiv.style.background = "rgba(74, 74, 74, .2)";
        this.overlayDiv.style.backdropFilter = "blur(0.20vw)";
    }
    
    pushDown(){
        this.overlayDiv.style.zIndex = -1;
        this.overlayDiv.style.background = "rgba(74, 74, 74, 0)";
        this.overlayDiv.backdropFilter = 'blur(0px)';
    }
}