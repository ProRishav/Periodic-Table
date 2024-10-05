function getData(loc){
    return fetch(loc)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
function getRGB(text){
    const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g;
    const match = rgbRegex.exec(text);
    return [match[1], match[2], match[3]];
}
function setBorder(text, div) {
    const rgb = getRGB(text);
    div.style.border = `0.08vw solid  rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, .5)`;
    return rgb;
}
function setShadow(text, div, vw){
    const rgb = getRGB(text);
    div.style.boxShadow = `0 0 ${vw}vw  rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
}
function hoverIn(elementDiv, elementData){
    const groupBlock = elementData.groupBlock.split(' ')[0]
    elementDiv.style.zIndex = '102';
    if (elementDiv.classList.contains('element-hover')){
        elementDiv.style.background = `linear-gradient(135deg,\
         ${elementColor[groupBlock].replace('alpha', '.3')},\
         ${elementColor[groupBlock].replace('alpha', '.6')})`;
        elementDiv.style.transform = "scale(1.4)";
        elementDiv.style.backdropFilter = "blur(0.39vw)";
    }
}
function hoverOut(elementDiv, elementData){
    const groupBlock = elementData.groupBlock.split(' ')[0]
    if (elementDiv.classList.contains('element-hover')){
        elementDiv.style.background = elementColor[groupBlock].replace('alpha', '1');
        elementDiv.style.transform = "scale(1)";
        elementDiv.style.backdropFilter = "blur(0)";
        if (!selective){
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

function checkHover(element){
    return element.classList.contains('element-hover') ? 'auto': '110';
}
// common templet for all the elements
function templet(elementData){
    const elementDiv = document.createElement('div');
    const groupBlock = elementData.groupBlock.split(' ')[0]
    elementDiv.classList.add('element');
    elementDiv.classList.add('element-hover');
    elementDiv.classList.add(`${groupBlock}`);
    elementDiv.style.position = 'relative';
    elementDiv.innerHTML = `
    <div class="element-shell">
        <div class="atomic-number">${elementData.atomicNumber}</div>
        <div class="symbol">${elementData.symbol}</div>
        <div class="name">${elementData.name}</div>
        <div class="atomic-weight">${parseFloat(String(elementData.atomicMass).split("(")[0]).toFixed(2)}</div>
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
    const elementInfo = elementDiv.querySelectorAll('.element-info')[0];
    elementInfo.style.background = elementColor[groupBlock].replace('alpha', '.3');
    elementInfo.style.backdropFilter = 'blur(5px)';
    elementDiv.style.background = elementColor[groupBlock].replace('alpha', '1');
    elementDiv.style.fontWeight = "200";
    return elementDiv;
}
function setZAuto(){
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
    typePanel.style.zIndex = 'auto;'
}
function initiateToggle(infoDiv){
    const element = infoDiv.parentElement;
    const shell = element.querySelectorAll('.element-shell')[0];
    const symbol = element.querySelectorAll('.symbol')[0];
    const atomicNumber = element.querySelectorAll('.atomic-number')[0];
    const name = element.querySelectorAll('.name')[0];
    const weight = element.querySelectorAll('.atomic-weight')[0];
    const innerInfoDiv = infoDiv.children;
    if (toggle){
        let rgb = getRGB(element.style.background);
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
            info.classList.add("anime");
        })
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
        name.style.top = "2.2vw";
        name.style.left = "0.39vw";
        name.style.fontSize = "0.41vw";
        Array.from(innerInfoDiv).forEach((info)=>{
            info.classList.remove("anime");
        })
    }

}
// Does something when element is clicked
let clicked = false;
let toggle = false;
function elementClicked(elementDiv){
    const elements =  document.querySelectorAll('.element');
    const lanthenides = document.getElementById('Lanthenides');
    const actinoides = document.getElementById('Actinoides');
    lanthenides.style.zIndex = 'auto';
    actinoides.style.zIndex = 'auto';
    const elementInfo = elementDiv.querySelectorAll('.element-info')[0]
    if (!clicked){
        setZAuto();
        Array.from(typePanel.children).forEach((type)=>{
            type.children[0].style.textShadow = '';
        type.children[0].style.filter = 'brightness(1)';
        type.style.transform = 'scale(1)';
        });
        elements.forEach((element)=>{
            element.style.boxShadow = '';
        })
        setBorder(elementDiv.style.background, elementDiv);
        typePanel.style.zIndex = 'auto';
        elementDiv.style.zIndex = 102;
        elementDiv.style.transform = "scale(3)";
        overlay.style.zIndex = 100;
        overlay.style.background = "rgba(74, 74, 74, .2)";
        overlay.style.backdropFilter = "blur(0.20vw)";
        elementDiv.classList.remove('element-hover');
        toggle = true;
        clicked = true;
    }else{
        initiateToggle(elementInfo);
        if (toggle){
            elementInfo.style.top = '0.78vw';
            toggle = false;
        }else{
            elementInfo.style.top = '100%';
            toggle = true;
        }
    }
}
function clickedGroupPeriod(group_period_Div, type){
    selective = true;
    const elements = document.querySelectorAll('.element');
    const group_period = group_period_Div.innerText;
    group_period_Div.style.zIndex = 101;
    group_period_Div.style.transform = "translateY(0vw) scale(1.4)";
    overlay.style.zIndex = 100;
    overlay.style.backgroundColor = "rgba(74, 74, 74, .2)";
    overlay.style.backdropFilter = "blur(0.20vw)";
    elements.forEach((element, index) => {
        const atomicNumber = element.innerText.split('\n')[0];
        const elementData = all_element_data.find(el => el.atomicNumber == atomicNumber);
        if (elementData[type]==group_period){
            setShadow(element.style.background, element, 0.39);
            element.style.zIndex = 101; 
        }
    })
}
function enterGroupPeriod(groupPeriodDiv){
    if (!selective){
        groupPeriodDiv.style.transform = "translateY(-0.39vw) scale(1.4)";
    }else{
        groupPeriodDiv.style.transform = "scale(1.4)";
    }
}
function clickedType(element_typeDiv){
    selective = true;
    Array.from(typePanel.children).forEach((typeDiv)=>{
        typeDiv.children[0].style.textShadow = '';
        typeDiv.style.filter = 'brightness(1)';
        typeDiv.style.transform = 'scale(1)';
    });
    const elements = document.querySelectorAll('.element');
    const type = element_typeDiv.children[0].innerText.split(' ')[0].toLowerCase()
    overlay.style.zIndex = 100;
    overlay.style.backgroundColor = "rgba(74, 74, 74, .2)";
    overlay.style.backdropFilter = "blur(0.20vw)";
    typePanel.style.zIndex = 101;
    element_typeDiv.children[0].style.textShadow = `0 0 0.78vw ${elementColor[type].replace('alpha', '1')}`;
    element_typeDiv.style.filter = 'brightness(1.5)';
    element_typeDiv.style.transform = 'scale(1.2)';
    elements.forEach((element)=>{
        element.style.zIndex = 'auto';
        element.style.boxShadow = '';
        if (element.classList.contains(type)){
            setShadow(element.style.background, element, 0.20)
            element.style.zIndex = 101;      
        }
    })
}
function clickedNoid(div, type){
    const elements = document.querySelectorAll('.element');
    selective = true;
    div.style.zIndex = 101;
    overlay.style.zIndex = 100;
    overlay.style.backgroundColor = "rgba(74, 74, 74, .2)";
    overlay.style.backdropFilter = "blur(0.20vw)";
    elements.forEach((element)=>{
        element.style.zIndex = 'auto';
        element.style.boxShadow = '';
        if (element.classList.contains(type)){
            setShadow(element.style.background, element, 0.20)
            element.style.zIndex = 101;      
        }
    })
    
}

const elementColor = {"alkali": 'rgba(0, 87, 163, alpha)',
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
let selective = false;
const overlay = document.querySelectorAll('.overlay')[0];

// For Groups
for (i=0; i<18; i++){
    const groupDiv = document.createElement('div');
    groupDiv.classList.add("group");
    groupDiv.style.gridArea = `1/${2+i}/2/${3+i}`;
    groupDiv.innerHTML = `
        <div class="group-number">${i+1}</div>
    `
    groupDiv.style.transition = "all .2s ease";
    groupDiv.addEventListener('click', ()=>{clickedGroupPeriod(groupDiv, 'group')});
    groupDiv.addEventListener('mouseenter', ()=>{
        enterGroupPeriod(groupDiv)
    });
    groupDiv.addEventListener('mouseleave', ()=>{
        groupDiv.style.transform = "translateY(0vw) scale(1)";
    });
    document.querySelector('.table').appendChild(groupDiv);
}
// For Periods
for (i=0; i<7; i++){
    const periodDiv = document.createElement('div');
    periodDiv.classList.add("period");
    periodDiv.style.gridArea = `${2+i}/1/${3+i}/2`;
    periodDiv.innerHTML = `
        <div class="period-number">${i+1}</div>
    `
    periodDiv.style.transition = "all .3s ease";
    periodDiv.addEventListener('click', ()=>{clickedGroupPeriod(periodDiv, 'period')});
    periodDiv.addEventListener('mouseenter', ()=>{
        enterGroupPeriod(periodDiv)
    });
    periodDiv.addEventListener('mouseleave', ()=>{
        periodDiv.style.transform = "translateY(0vw) scale(1)";
    });
    document.querySelector('.table').appendChild(periodDiv);
}

const blank0 = document.createElement('div');
blank0.style.gridArea = "1 / 1 / 2 / 2";
document.querySelector('.table').appendChild(blank0);
const panel = document.createElement('div');
panel.style.gridArea = "3 / 4 / 5 / 14";
document.querySelector('.table').appendChild(panel);
const typePanel = document.createElement('div');
typePanel.style.gridArea = "3/3/2/19";
document.querySelector('.table').appendChild(typePanel);
const blank4 = document.createElement('div');
blank4.style.gridArea = "9/1/10/20";
document.querySelector('.table').appendChild(blank4);
const blank5 = document.createElement('div');
blank5.style.gridArea = "10/1/12/5";
document.querySelector('.table').appendChild(blank5);

let all_element_data = -1;
getData('data.json')
.then(data => {
    all_element_data = data;
    for (let i = 1; i <= 118; i++) {
        if ((i<57 || i>71) & (i<89 || i>103)){
            const elementData = all_element_data.find(el => el.atomicNumber === i);
            const elementDiv = templet(elementData);
            elementDiv.addEventListener('click', function(){
                elementClicked(elementDiv);
            })
            elementDiv.addEventListener('mouseenter', ()=>{
                hoverIn(elementDiv, elementData);
            });
            elementDiv.addEventListener('mouseleave', ()=>{
                hoverOut(elementDiv, elementData);
            });
            document.querySelector('.table').appendChild(elementDiv);
            
        }
    }
    all_element_data.forEach(element => {
        const atom_num = element.atomicNumber;
        if ((atom_num>=57 & atom_num<=71) || (atom_num>=89 & atom_num<=103)){
            const elementDiv = templet(element);
            const elementData = all_element_data.find(el => el.atomicNumber === atom_num);
            elementDiv.addEventListener('click', function(){
                elementClicked(elementDiv);
            })
            elementDiv.addEventListener('mouseenter', ()=>{
                hoverIn(elementDiv, elementData);
            });
            elementDiv.addEventListener('mouseleave', ()=>{
                hoverOut(elementDiv, elementData);
            });
            document.querySelector('.table').appendChild(elementDiv);
        }
    });
    const elementType = new Set();
    all_element_data.forEach((element)=>{
        elementType.add(element.groupBlock);
    })
    typePanel.style.display = "flex";
    typePanel.style.justifyContent = "space-around";
    typePanel.style.textAlign = "center";
    typePanel.style.padding = "0.39vw 1.95vw";
    typePanel.style.color = "aliceblue";
    elementType.forEach((type)=>{
        const element_typeDiv = document.createElement('div');
        element_typeDiv.innerHTML = `
            <div class="${type.split('(')[0]}-select">${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</div>
        `
        element_typeDiv.style.fontSize = '0.71vw';
        element_typeDiv.style.color = elementColor[type.split(' ')[0]].replace('alpha', '1');
        element_typeDiv.style.fontWeight = 900;
        element_typeDiv.style.transition = "all .3s ease";
        element_typeDiv.style.padding = '0.39vw';
        element_typeDiv.children[0].addEventListener('click', ()=>{
            clickedType(element_typeDiv);
        })
        element_typeDiv.children[0].addEventListener('mouseenter', ()=>{
            element_typeDiv.style.transform = 'scale(1.2)';
            element_typeDiv.style.filter = 'brightness(1.5)';
        })
        element_typeDiv.children[0].addEventListener('mouseleave', ()=>{
            element_typeDiv.style.transform = 'scale(1)';
            if (!element_typeDiv.children[0].style.textShadow){
                element_typeDiv.style.filter = 'brightness(1)';
            }else{
                element_typeDiv.style.filter = 'brightness(1.5)';
                element_typeDiv.style.transform = 'scale(1.2)';
            }
        })
        typePanel.appendChild(element_typeDiv);
    });
    // Adding Lanthenoid and actinide....
    const lanthenides = document.createElement('div');
    lanthenides.style.background = elementColor['lanthanoid'].replace('alpha', '1')
    lanthenides.innerHTML = `
        <div>57-71</div>
        <div>Lanthenides</div>
    `
    lanthenides.addEventListener('click', ()=>{
        lanthenides.style.zIndex = 101;
        clickedNoid(lanthenides, 'lanthanoid')
    });
    lanthenides.classList.add('nides');
    lanthenides.id = 'Lanthenides';
    lanthenides.style.gridArea = "7/4/8/5";
    document.querySelector('.table').appendChild(lanthenides);
    const actinoides = document.createElement('div');
    actinoides.style.background = elementColor['actinoid'].replace('alpha', '1')
    actinoides.innerHTML = `
        <div>89-103</div>
        <div>actinoides</div>
    `
    actinoides.addEventListener('click', ()=>{
        actinoides.style.zIndex = 101;
        clickedNoid(actinoides, 'actinoid')
    });
    actinoides.classList.add('nides')
    actinoides.id = "Actinoides";
    actinoides.style.gridArea = "8/4/9/5";
    actinoides.classList.add('actinoid');
    document.querySelector('.table').appendChild(actinoides);
})
.catch(error => {
    console.error('Error:', error);
});
overlay.addEventListener('click', function (){
    selective = false;
    overlay.style.zIndex = "-1";
    overlay.style.background = "rgba(74, 74, 74, 0)";
    const elements = document.querySelectorAll('.element');
    const actinoides = document.getElementById('Actinoides');
    const lanthenides = document.getElementById('Lanthenides');
    toggle = false;
    elements.forEach(function(element, index) {
        // Finding the group Using intersection
        const groupBlock = element.classList.value.split(' ').filter(value => Object.keys(elementColor).includes(value))[0];
        element.style.background = elementColor[groupBlock].replace('alpha', '1')
        const elementInfo = element.querySelectorAll('.element-info')[0]
        element.classList.add('element-hover');
        element.style.transform = 'scale(1)';
        elementInfo.style.top = '100%';
        element.style.boxShadow = '';
        initiateToggle(elementInfo);
        element.style.border = ''
    });
    Array.from(typePanel.children).forEach((type)=>{
        type.children[0].style.textShadow = '';
        type.children[0].style.filter = 'brightness(1)';
        type.style.transform = 'scale(1)';
    });
    lanthenides.style.zIndex = 'auto';
    actinoides.style.zIndex = 'auto';
    typePanel.style.zIndex = 'auto';
    setZAuto();
    clicked = false;
    toggle = true;
});