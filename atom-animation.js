// Some Utility functions
function expandElectronConfig(all_config, electron_config){
    const patternEC = /\[\w+\]/;
    let match;
    if (match = electron_config.match(patternEC)){
        electron_config = electron_config.replace(patternEC, all_config[match[0].slice(1, -1)])
        return expandElectronConfig(all_config, electron_config);
    }else{
        return electron_config;
    }
}

function parseElectronConfiguration(configStr) {
    const maxElectronsPerShell = [2, 8, 18, 32, 32, 18, 8];
    const config = Array(maxElectronsPerShell.length).fill(0);
    const orbitPattern = /(\d)([spdf])(\d+)/g;
    let match;
    while ((match = orbitPattern.exec(configStr)) !== null) {
      const shell = parseInt(match[1]) - 1;
      const electronCount = parseInt(match[3]);
      config[shell] += electronCount;
    }
    return config;
}


// Class AtomCanvas
class AtomCanvas {
    constructor (canvas){
        this.atomCanvas = canvas;
        this.context = this.atomCanvas.getContext("2d");
        this.atomCanvas.style.background = 'transparent';
        this.allElementData = {};
        this.allElectronicConfig = {};
        allElementData.forEach((elementData)=>{
            this.allElementData[elementData.symbol] = elementData;
            this.allElectronicConfig[elementData.symbol] = elementData.electronicConfiguration;
        });
        this.animationFrameId = null;
        this.electronConfigStr = null;
        this.electronConfig = [];
        this.orbitRadii = [];
        this.electrons = [];
        this.electronSpeed = 0;
        this.atomPreview = document.querySelectorAll('#element-info')[0];
        this.elementNameSymbol = document.querySelectorAll('.element-name-symbol')[0];
        this.wikipedia = document.querySelectorAll('#wikipedia')[0];
        this.updateCanvasSize();
        this.animate = this.animate.bind(this);

        this.atomPreview.addEventListener('mouseenter', ()=>{this.hoverIn()});
        this.atomPreview.addEventListener('mouseleave', ()=>{this.hoverOut()});
        
    }
    updateCanvasSize() {
        this.vw = window.innerWidth / 100;
        this.atomCanvas.width = 18 * this.vw;
        this.atomCanvas.height = 18 * this.vw;
    }
    animate() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.context.fillRect(0, 0, this.atomCanvas.width, this.atomCanvas.height);
        this.context.clearRect(0, 0, this.atomCanvas.width, this.atomCanvas.height);
        this.electrons.forEach(({ orbitIndex, angles }) => {
            this.context.beginPath();
            this.context.arc(this.atomCanvas.width / 2, this.atomCanvas.height / 2, this.orbitRadii[orbitIndex], 0, 2 * Math.PI);
            this.context.strokeStyle = "#fff";
            this.context.stroke();
            angles.forEach((angle, electronIndex) => {
                angles[electronIndex] += this.electronSpeed / (orbitIndex + 1);
                const x = this.atomCanvas.width / 2 + this.orbitRadii[orbitIndex] * Math.cos(angles[electronIndex]);
                const y = this.atomCanvas.height / 2 + this.orbitRadii[orbitIndex] * Math.sin(angles[electronIndex]);
                this.context.beginPath();
                this.context.arc(x, y, 0.195*this.vw, 0, 2 * Math.PI);
                this.context.fillStyle = "#fff";
                this.context.fill();
          });
        });
    
        this.animationFrameId = requestAnimationFrame(this.animate);
    }
    updatePreview(symbol){
        const elementData = this.allElementData[symbol];
        const elementAtomicNum = document.getElementById('elementAtomicNum');
        const elementSymbol = document.getElementById('elementSymbol');
        const elementName = document.getElementById('elementName');
        const wikipedia = document.getElementById('wikipedia').querySelector("a");
        const electronConfig = expandElectronConfig(this.allElectronicConfig, elementData.electronicConfiguration);
        const eachProperty = document.querySelectorAll(".property");

        eachProperty.forEach((eachPropertyElement)=>{
            eachPropertyElement.nextElementSibling.innerHTML = elementData[eachPropertyElement.innerHTML];
        });
        elementAtomicNum.innerHTML = elementData.atomicNumber;
        elementSymbol.innerHTML = elementData.symbol;
        elementName.innerHTML = elementData.name;
        wikipedia.href = `https://en.wikipedia.org/wiki/${elementData.name}`
        this.updateCanvas(electronConfig);
        this.updateElectronConfig(this.electrons);
    }
    updateCanvas(electronConfigStr){
        if (typeof electronConfigStr === 'string'){
            this.electronConfigStr = electronConfigStr;
        }
        this.electronConfig = parseElectronConfiguration(this.electronConfigStr);
        this.electronConfig = this.electronConfig.filter(num => num !== 0);
        this.updateCanvasSize();
        this.orbitRadii = AtomCanvas.getRadii(this.electronConfig, this.atomCanvas.width);
        this.electronSpeed = 0.001 * Math.log(this.atomCanvas.width);
        this.electrons = [];
        this.electronConfig.forEach((electronCount, orbitIndex) => {
            if (electronCount > 0) {
                const orbit = [];
                for (let i = 0; i < electronCount; i++) {
                    const angle = (i / electronCount) * 2 * Math.PI;
                    orbit.push(angle);
                }
                this.electrons.push({ orbitIndex, angles: orbit });
            }
        });
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animate();
    }
    updateElectronConfig(electronConfig){
        const electronConfigDiv = document.getElementById('electronConfig');
        let div = '';
        electronConfig.forEach(({ orbitIndex, angles })=>{
            div += `<p class='electron-config-data'>${angles.length}</p>\n`
        });
        electronConfigDiv.innerHTML = div;
    }
    hoverIn(){
        this.elementNameSymbol.style.transform = 'translateX(-50%) translateY(calc(-65% + .5vw))'
        this.wikipedia.style.opacity = 1;
        this.wikipedia.style.transform = 'translateX(-50%) translateY(-10%)'
    }
    hoverOut(){
        this.elementNameSymbol.style.transform = 'translateX(-50%) translateY(calc(-50% + .5vw))'
        this.wikipedia.style.opacity = 0;
        this.wikipedia.style.transform = 'translateX(-50%) translateY(0%)';
    }
    static getRadii(electronConfig, canvasWidth){
        let orbitRadii = [];
        const SEP = 0.5 * canvasWidth / (electronConfig.length+1);
        for (let i=1; i<=electronConfig.length+1; i++){
            orbitRadii.push(i*SEP);
        }
        return orbitRadii;
    }
}