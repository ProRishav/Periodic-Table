class Table {
    constructor (divElement, gridTemplateColumns, gridTemplateRows){
        this.table = divElement;
        this.gridTemplateColumns = gridTemplateColumns;
        this.gridTemplateRows = gridTemplateRows;
        this.gridGap = '0.20vw';
        this.defaultElementColors = {"alkali": 'rgba(0, 87, 163, alpha)',
            "alkaline": 'rgba(76, 175, 80, alpha)',
            "transition": 'rgba(74, 74, 74, alpha)',
            "metal": 'rgba(205, 127, 50, alpha)',
            "metalloid": 'rgba(218, 165, 32, alpha)',
            "nonmetal": 'rgba(85, 107, 47, alpha)',
            "halogen": 'rgba(46, 139, 87, alpha)',
            "noble": 'rgba(147, 112, 219, alpha)',
            "post-transition": 'rgba(188, 143, 143, alpha)',
            "lanthanoid": 'rgba(199, 21, 133, alpha)',
            "actinoid": 'rgba(102, 51, 153, alpha)'
        }
        this.electronConfigSPDF = {};
        this.elementDivs = {};
        this.allElementData = {};
        allElementData.forEach((elementData)=>{this.allElementData[elementData.symbol] = elementData});
        this.lanthanoidsActinoids = {};
        this.elementColorMap = this.defaultColorMap();
        this.groupBlockPanel = null;
        this.hoverInFunc = ()=>{};
        this.hoverOutFunc = ()=>{};
        this.currentHoverElement = 'H';
        this.table.style.gridTemplateColumns = this.gridTemplateColumns;
        this.table.style.gridTemplateRows = this.gridTemplateRows;
        this.table.style.gridGap = this.gridGap;
        this.selective = false;
        this.clicked = false;
        this.toggle = true;
    }
    addBlank(rowStart, columnStart, width, height, bg){
        const blankDiv = document.createElement('div');
        blankDiv.style.gridArea = `${rowStart} / ${columnStart} / ${rowStart+height} / ${columnStart+width}`;
        blankDiv.style.background = bg;
        this.table.appendChild(blankDiv);
        return blankDiv;
    }
    addGroups(){
        range(1, 19).forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('group');
            groupDiv.style.gridArea = `1/ ${index+2} / 1 / ${index+3}`;
            groupDiv.innerHTML = `${group}`;
            groupDiv.style.transition = "all .2s ease";
            groupDiv.style.color = 'aliceblue';
            groupDiv.style.background = 'transparent';
            groupDiv.style.textAlign = 'center';
            groupDiv.style.height = '100%';
            groupDiv.style.fontSize = '0.80vw';
            groupDiv.style.cursor = 'pointer';
            groupDiv.addEventListener('click', ()=>{this.clickedGroupPeriod(groupDiv, 'group')});
            groupDiv.addEventListener('mouseenter', ()=>{
                Table.enterGroupPeriod(groupDiv);
            });
            groupDiv.addEventListener('mouseleave', ()=>{
                groupDiv.style.transform = "translateY(0vw) scale(1)";
            });
            this.table.appendChild(groupDiv);
        });
    }
    addPeriods(){
        range(1, 8).forEach((period, index) => {
            const periodDiv = document.createElement('div');
            periodDiv.classList.add('period');
            periodDiv.style.gridArea = `${index+2}/ 1 / ${index+3} / 1`;
            periodDiv.innerHTML = `${period}`;
            periodDiv.style.transition = "all .2s ease";
            periodDiv.style.color = 'aliceblue';
            periodDiv.style.background = 'transparent';
            periodDiv.style.height = '100%';
            periodDiv.style.fontSize = '0.80vw';
            periodDiv.style.cursor = 'pointer';
            periodDiv.style.display = 'flex';
            periodDiv.style.alignItems = 'center';
            periodDiv.style.justifyContent = 'center';
            periodDiv.addEventListener('click', ()=>{this.clickedGroupPeriod(periodDiv, 'period')});
            periodDiv.addEventListener('mouseenter', ()=>{
                Table.enterGroupPeriod(periodDiv);
            });
            periodDiv.addEventListener('mouseleave', ()=>{
                periodDiv.style.transform = "translateY(0vw) scale(1)";
            });
            this.table.appendChild(periodDiv);
        });
    }
    addElementFolds(){
        // lanthanoids
        const lanthanoids = this.addBlank(7, 4, 1, 1, "rgba(199, 21, 133, 1)");
        lanthanoids.innerHTML = `
            <div>57-71</div>
            <div>lanthanoids</div>
        `
        lanthanoids.addEventListener('click', ()=>{
            lanthanoids.style.zIndex = 101;
            this.clickedNoid(lanthanoids, 'lanthanoid');
        });
        lanthanoids.classList.add('noids');
        lanthanoids.id = 'Lanthanoids';
        // Actinoids
        const actinoids = this.addBlank(8, 4, 1, 1, "rgba(102, 51, 153, 1)");
        actinoids.innerHTML = `
            <div>89-103</div>
            <div>actinoids</div>
        `
        actinoids.addEventListener('click', ()=>{
            actinoids.style.zIndex = 101;
            this.clickedNoid(actinoids, 'actinoid');
        });
        actinoids.classList.add('noids')
        actinoids.id = "Actinoids";
        
        this.table.appendChild(lanthanoids);
        this.table.appendChild(actinoids);
    }
    clickedNoid(div, type){
        this.selective = true;
        div.style.zIndex = 101;
        this.selectElements('groupBlock', type);
    }
    addGroupBlockPanel(){
        this.groupBlockPanel = this.addBlank(2, 3, 16, 1, 'transparent');
        this.groupBlockPanel.style.display = "flex";
        this.groupBlockPanel.style.justifyContent = "space-around";
        this.groupBlockPanel.style.textAlign = "center";
        this.groupBlockPanel.style.padding = "0.39vw 1.95vw";
        const elementTypes = Object.keys(this.defaultElementColors);
        elementTypes.forEach((type)=>{
            const elementTypeDiv = document.createElement('div');
            elementTypeDiv.innerHTML = `
                <div class="${type.split('(')[0]}-select">${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</div>
            `
            elementTypeDiv.style.fontSize = '0.71vw';
            elementTypeDiv.style.color = this.defaultElementColors[type.split(' ')[0]].replace('alpha', '1');
            elementTypeDiv.style.fontWeight = 900;
            elementTypeDiv.style.transition = "all .3s ease";
            elementTypeDiv.style.padding = '0.39vw';
            elementTypeDiv.children[0].addEventListener('click', ()=>{
                this.clickedElementType(elementTypeDiv);
            })
            elementTypeDiv.children[0].addEventListener('mouseenter', ()=>{
                elementTypeDiv.style.transform = 'scale(1.2)';
                elementTypeDiv.style.filter = 'brightness(1.5)';
                elementTypeDiv.children[0].style.cursor = 'pointer';
            });
            elementTypeDiv.children[0].addEventListener('mouseleave', ()=>{
                elementTypeDiv.style.transform = 'scale(1)';
                if (!elementTypeDiv.children[0].style.textShadow){
                    elementTypeDiv.style.filter = 'brightness(1)';
                }else{
                    elementTypeDiv.style.filter = 'brightness(1.5)';
                    elementTypeDiv.style.transform = 'scale(1.2)';
                }
            });
            this.groupBlockPanel.appendChild(elementTypeDiv);
        });
    }
    clickedElementType(elementTypeDiv){
        this.selective = true;
        Array.from(this.groupBlockPanel.children).forEach((typeDiv)=>{
            typeDiv.children[0].style.textShadow = '';
            typeDiv.style.filter = 'brightness(1)';
            typeDiv.style.transform = 'scale(1)';
        });
        const type = elementTypeDiv.children[0].innerText.split(' ')[0].toLowerCase()
        this.groupBlockPanel.style.zIndex = 101;
        elementTypeDiv.children[0].style.textShadow = `0 0 0.78vw ${this.defaultElementColors[type].replace('alpha', '1')}`;
        elementTypeDiv.style.filter = 'brightness(1.5)';
        elementTypeDiv.style.transform = 'scale(1.2)';
        this.selectElements('groupBlock', type);
    }
    addElements(){
        this.lanthanoidsActinoids = allElementData.slice(56, 71).concat(allElementData.slice(88, 103));
        this.otherElements = allElementData.filter(item => !this.lanthanoidsActinoids.includes(item));

        this.otherElements.forEach(element=>{
            const elementData = element;
            const elementDiv = this.templet(elementData);
            this.onHover(elementData.symbol);
            this.table.appendChild(elementDiv);
        });
        this.lanthanoidsActinoids.forEach(element=>{
            const elementData = element;
            const elementDiv = this.templet(elementData);
            this.onHover(elementData.symbol);
            this.table.appendChild(elementDiv);
        });
        this.updateTempletTexts('atomicMass');
    }
    onElementClick(func){
        Object.values(this.elementDivs).forEach(element=>{
            const elementDiv = element;
            elementDiv.addEventListener('click', ()=>{
                this.elementClicked(elementDiv);
                func();
            });
        });
    }
    templet(elementData){
        const elementDiv = document.createElement('div');
        this.elementDivs[elementData.symbol] = elementDiv;
        const groupBlock = elementData.groupBlock.split(' ')[0]
        this.electronConfigSPDF[elementData.symbol] = elementData.electronicConfiguration;
        elementDiv.classList.add('element');
        elementDiv.classList.add('element-hover');
        elementDiv.classList.add(`${groupBlock}`);
        elementDiv.style.position = 'relative';
        elementDiv.innerHTML = `
        <div class="element-shell">
            <div class="atomic-number">${elementData.atomicNumber}</div>
            <div class="symbol">${elementData.symbol}</div>
            <div class="name">${elementData.name}</div>
            <div class="atomic-weight"></div>
        </div>
        <div class="element-info">
            <div class="info">
                <div>Atomic Mass</div>
                <div>${String(elementData.atomicMass).split('(')[0]}</div>
            </div>
            <div class="info">
                <div>Electronic Configuration</div>
                <div style="text-align:right">${String(elementData.electronicConfiguration).split('(')[0]}</div>
            </div>
            <div class="info">
                <div>Phase at STD</div>
                <div style="text-align:right">${elementData.standardState}</div>
            </div>
            <div class="info">
                <div>Melting Point</div>
                <div style="text-align:right">${elementData.meltingPoint} ${(elementData.meltingPoint=="unknown")? '':'K'}</div>
            </div>
            <div class="info">
                <div>Boiling Point</div>
                <div style="text-align:right">${elementData.boilingPoint} ${(elementData.meltingPoint=="unknown")? '':'K'}</div>
            </div>
            <div class="info">
                <div>Oxidation States</div>
                <div style="text-align:right">${elementData.oxidationStates}</div>
            </div>
            <div class="info">
                <div>Group Block</div>
                <div style="text-align:right">${elementData.groupBlock}</div>
            </div>
            <div class="info">
                <div>Year Discovered</div>
                <div style="text-align:right">${elementData.yearDiscovered}</div>
            </div>
        </div>
        `;
        this.updateElementBackground();
        return elementDiv;
    }
    updateElementBackground(){
        Object.keys(this.elementDivs).forEach((element)=>{
            const elementDiv = this.elementDivs[element];
            elementDiv.style.transition = "transform 0.07s ease, backdrop-filter 0.3s ease, background-color 0.3s ease";
            const elementInfo = elementDiv.querySelectorAll('.element-info')[0];
            if (this.clicked){
                elementDiv.style.background = `linear-gradient(135deg,\
                ${this.elementColorMap[element].replace('alpha', '.3')},\
                ${this.elementColorMap[element].replace('alpha', '.6')})`;
                elementDiv.style.backdropFilter = "blur(0.39vw)";
            }else{
                elementDiv.style.background = this.elementColorMap[element].replace('alpha', '1');
            }
            // elementDiv.style.fontWeight = "200";
            elementInfo.style.background = this.elementColorMap[element].replace('alpha', '.3');
            elementInfo.style.backdropFilter = 'blur(5px)';
            elementDiv.style.borderColor = this.elementColorMap[element].replace('alpha', '.5');
            setTimeout(() => {
                elementDiv.style.transition = "transform 0.07s ease, backdrop-filter 0.3s ease";
            }, 300);
        });
    }
    clickedGroupPeriod(groupPeriodDiv, type){
        this.selective = true;
        const groupPeriod = groupPeriodDiv.innerText;
        groupPeriodDiv.style.zIndex = 101;
        groupPeriodDiv.style.transform = "translateY(0vw) scale(1.4)";

        this.selectElements(type, groupPeriod);
    }
    defaultColorMap(){
        let map = {};
        allElementData.forEach((elementData)=>{
            const groupBlock = elementData.groupBlock.split(' ')[0]
            map[elementData.symbol] = this.defaultElementColors[groupBlock];
        });
        return map;
    }
    elementClicked(elementDiv){
        console.log(this.clicked)
        const lanthanoids = document.getElementById('Lanthanoids');
        const actinoids = document.getElementById('Actinoids');
        lanthanoids.style.zIndex = 'auto';
        actinoids.style.zIndex = 'auto';
        const elementInfo = elementDiv.querySelectorAll('.element-info')[0];
        if (!this.clicked){
            Table.setZAuto();
            Array.from(this.groupBlockPanel.children).forEach((type)=>{
                type.children[0].style.textShadow = '';
                type.children[0].style.filter = 'brightness(1)';
                type.style.transform = 'scale(1)';
            });
            Object.values(this.elementDivs).forEach((element)=>{
                element.style.boxShadow = '';
            });
            setBorder(elementDiv.style.background, elementDiv);
            
            this.groupBlockPanel.style.zIndex = 'auto';
            elementDiv.style.zIndex = 102;
            elementDiv.style.transform = "scale(3)";
            elementDiv.classList.remove('element-hover');
            this.toggle = true;
            this.clicked = true;
        }else{
            this.initiateToggle(elementDiv);
            this.toggle = !this.toggle;
        }
    }
    onHover(elementSymbol){
        let elementDiv = this.elementDivs[elementSymbol];
        elementDiv.addEventListener('mouseenter', ()=>{
            this.defaultHoverIn(elementSymbol);
            this.hoverInFunc();
        });
        elementDiv.addEventListener('mouseleave', ()=>{
            this.defaultHoverOut(elementSymbol);
            this.hoverOutFunc();
        });
    }
    defaultHoverIn(elementSymbol){
        this.currentHoverElement = elementSymbol;
        const elementData = this.allElementData[elementSymbol];
        const elementDiv = this.elementDivs[elementSymbol];
        elementDiv.style.zIndex = '102';
        if (elementDiv.classList.contains('element-hover')){
            elementDiv.style.background = `linear-gradient(135deg,\
             ${this.elementColorMap[elementSymbol].replace('alpha', '.3')},\
             ${this.elementColorMap[elementSymbol].replace('alpha', '.6')})`;
            elementDiv.style.transform = "scale(1.4)";
            elementDiv.style.backdropFilter = "blur(0.39vw)";
        }
    }
    defaultHoverOut(elementSymbol){
        const elementDiv = this.elementDivs[elementSymbol];
        if (elementDiv.classList.contains('element-hover')){
            elementDiv.style.background = this.elementColorMap[elementSymbol].replace('alpha', '1');
            elementDiv.style.transform = "scale(1)";
            elementDiv.style.backdropFilter = "blur(0)";
            if (!this.selective){
                elementDiv.style.zIndex = '10';// To fix a little glitch
                elementDiv.style.zIndex = 'auto';
            }
            else{
                elementDiv.style.zIndex = '101';
            }
        }else{
            elementDiv.style.zIndex = '101';
        }
    }
    selectElements(type, value){
        const overlay = new Overlay(document.querySelectorAll('.overlay')[0]);
        overlay.pushUp();
        Object.keys(this.elementDivs).forEach((symbol)=>{
            const element = this.elementDivs[symbol];
            const elementData = this.allElementData[symbol];
            element.style.zIndex = 'auto';
            element.style.boxShadow = '';
            if (String(elementData[type]).split(' ')[0]==value){
                setShadow(element.style.background, element, 0.20);
                element.style.zIndex = 101;
            }
        });
    }
    updateAccordingTo(accord, minHEX, maxHEX){
        let weights = {};
        Object.keys(this.allElementData).forEach((symbol)=>{
            weights[symbol] = this.allElementData[symbol][accord];
        });
        const gradiant = Table.generateGradientArray(Object.values(weights), minHEX, maxHEX);
        Object.keys(this.allElementData).forEach((symbol, index)=>{
            this.elementColorMap[symbol] = gradiant[index];
        });
        this.updateElementBackground();
        this.updateTempletTexts(accord);
        return this.elementColorMap;
    }
    updateTempletTexts(about){
        Object.keys(this.elementDivs).forEach((element)=>{
            const elementDiv = this.elementDivs[element];
            const atomWeightDiv = elementDiv.querySelectorAll('.atomic-weight')[0];
            atomWeightDiv.innerHTML = isNaN(this.allElementData[element][about]) ? this.allElementData[element][about] : roundIfFloat(this.allElementData[element][about], 3);
        });
    }
//=======================================================================
    addBlanks(){
        this.addBlank(1, 1, 1, 1, 'transparent');
        this.addBlank(3, 4, 10, 2, 'transparent');
        this.addBlank(9, 1, 19, 1, 'transparent');
        this.addBlank(10, 1, 4, 2, 'transparent');
    }
    addGroupsPeriods(){
        this.addGroups();
        this.addPeriods();
    }
    addAllElements(){
        this.addElementFolds();
        this.addElements();
    }
    deploy(){
        this.addBlanks();
        this.addGroupsPeriods();
        this.addGroupBlockPanel();
        this.addAllElements();
    }
    reset(){
        const actinoids = document.getElementById('Actinoids');
        const lanthanoids = document.getElementById('Lanthanoids');

        this.selective = false;
        this.clicked = false;
        this.toggle = false;
        Object.keys(this.elementDivs).forEach((elementSymbol, index) => {
            const element = this.elementDivs[elementSymbol];
            // Finding the group Using intersection
            element.style.background = this.elementColorMap[elementSymbol].replace('alpha', '1');
            const elementInfo = element.querySelectorAll('.element-info')[0];
            element.classList.add('element-hover');
            element.style.transform = 'scale(1)';
            elementInfo.style.top = '100%';
            element.style.boxShadow = '';
            this.initiateToggle(element);
            element.style.border = '';
        });
        Array.from(this.groupBlockPanel.children).forEach((type)=>{
            type.children[0].style.textShadow = '';
            type.children[0].style.filter = 'brightness(1)';
            type.style.transform = 'scale(1)';
        });
        lanthanoids.style.zIndex = 'auto';
        actinoids.style.zIndex = 'auto';
        this.groupBlockPanel.style.zIndex = 'auto';
        Table.setZAuto();

    }
    initiateToggle(elementDiv){
        const infoDiv = elementDiv.querySelectorAll('.element-info')[0];
        const shell = elementDiv.querySelectorAll('.element-shell')[0];
        const symbol = elementDiv.querySelectorAll('.symbol')[0];
        const atomicNumber = elementDiv.querySelectorAll('.atomic-number')[0];
        const name = elementDiv.querySelectorAll('.name')[0];
        const weight = elementDiv.querySelectorAll('.atomic-weight')[0];
        const innerInfoDiv = infoDiv.children;
        if (this.toggle){
            let rgb = getRGB(elementDiv.style.background);
            symbol.style.top = "50%";
            symbol.style.left = "50%";
            symbol.style.fontWeight = "900";
            symbol.style.transform = "translateX(-50%) scale(2)";
            symbol.style.color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
            weight.style.opacity = "0";
            atomicNumber.style.top = "0.2vw";
            atomicNumber.style.right = "0.3vw";
            atomicNumber.style.fontSize = "0.31vw";
            name.style.top = "0.18vw";
            name.style.left = "0.3vw";
            name.style.fontSize = "0.31vw";
            Array.from(innerInfoDiv).forEach((info)=>{
                info.classList.add("animate");
            });
            infoDiv.style.top = '0.78vw';
        }else{
            symbol.style.top = "0.9vw";
            symbol.style.left = "0.39vw";
            symbol.style.fontWeight = "400";
            symbol.style.transform = "translateX(0) scale(1)";
            symbol.style.color = 'aliceblue';
            weight.style.opacity = "1";
            atomicNumber.style.top = "0.39vw";
            atomicNumber.style.right = "0.39vw";
            atomicNumber.style.fontSize = "0.51vw";
            name.style.top = "2.3vw";
            name.style.left = "0.39vw";
            name.style.fontSize = "0.41vw";
            Array.from(innerInfoDiv).forEach((info)=>{
                info.classList.remove("animate");
            });
            infoDiv.style.top = '100%';
        }
    
    }
    static setZAuto(){
        const elements = document.querySelectorAll('.element');
        const groups = document.querySelectorAll('.group');
        const periods = document.querySelectorAll('.period');
        elements.forEach((element) => {
            element.style.zIndex = '10';
            element.style.zIndex = 'auto';
        })
        groups.forEach((group) => {
            group.style.zIndex = '10';
            group.style.zIndex = 'auto';
        })
        periods.forEach((period) => {
            period.style.zIndex = '10';
            period.style.zIndex = 'auto';
        })
    }
    static enterGroupPeriod(groupPeriodDiv){
        if (!this.selective){
            groupPeriodDiv.style.transform = "translateY(-0.39vw) scale(1.4)";
        }else{
            groupPeriodDiv.style.transform = "scale(1.4)";
        }
    }
    static generateGradientArray(values, minColor, maxColor) {
        function lerp(start, end, t) {
            return start + (end - start) * t;
        }
        function hexToRgb(hex) {
            const bigint = parseInt(hex.slice(1), 16);
            return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        }
        const minRGB = hexToRgb(minColor);
        const maxRGB = hexToRgb(maxColor);
        const grayRGB = [128, 128, 128];
        let gradientColors = [];
        const validValues = values
        .filter(value => !isNaN(value) && value !== null && value !== undefined)
        .map(Number);
        values.forEach((value, index) => {
            if (isNaN(value) | value === null | value === undefined) {
                gradientColors.push(`rgba(${grayRGB[0]}, ${grayRGB[1]}, ${grayRGB[2]}, alpha)`);
            } else {
                let t = index / (validValues.length - 1);
                let r = Math.round(lerp(minRGB[0], maxRGB[0], t));
                let g = Math.round(lerp(minRGB[1], maxRGB[1], t));
                let b = Math.round(lerp(minRGB[2], maxRGB[2], t));
                gradientColors.push(`rgba(${r}, ${g}, ${b}, alpha)`);
            }
        });
        return gradientColors;
    }
}

// Utility functions
function setShadow(text, div, vw){
    const rgb = getRGB(text);
    div.style.boxShadow = `0 0 ${vw}vw  rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
}
function getRGB(text){
    const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g;
    const match = rgbRegex.exec(text);
    return [match[1], match[2], match[3]];
}

function range(start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}
function setBorder(text, div) {
    const rgb = getRGB(text);
    div.style.border = `0.08vw solid  rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, .5)`;
    return rgb;
}
function roundIfFloat(num, digits) {
    num = parseFloat(num);
    if (!Number.isInteger(num)) {
        return parseFloat(num).toFixed(digits);
    }
    return num;
}