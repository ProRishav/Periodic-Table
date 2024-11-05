function main(){
    const overlayDiv = document.querySelectorAll('.overlay')[0]
    const overlay = new Overlay(overlayDiv);
    const div = document.querySelectorAll('.table')[0];
    const table = new Table(div,
        '1.57vw repeat(18, minmax(0.39vw, 1fr))',
        '1.57vw repeat(7, minmax(0.39vw, 1fr)) 1.17vw repeat(2, minmax(00.39vw, 1fr))');
    const sidePanelDiv = document.querySelectorAll('.side-panel')[0];
    const sidePanel = new SidePanel(sidePanelDiv);
    const ATOM_CANVAS = document.getElementById('atom');
    let atomCanvas = new AtomCanvas(ATOM_CANVAS);
    atomCanvas.updateCanvas('1s1');

    overlay.cast();
    table.hoverInFunc = updateAtomPreview; //This should come before deploying
    table.deploy();
    table.onElementClick(elementClicked);
    overlay.onClick(()=>{table.reset()});
    atomCanvas.updatePreview(table.currentHoverElement);
    function elementClicked(){
        overlay.overlayDiv.style.zIndex = 100;
        overlay.overlayDiv.style.background = "rgba(74, 74, 74, .2)";
        overlay.overlayDiv.style.backdropFilter = "blur(0.20vw)";
    }

    function updateAtomPreview(){
        atomCanvas.updatePreview(table.currentHoverElement);
    }
    function shiftTable(){
        if (sidePanel.pannelToggle){
            table.table.style.left = "3vw";
        }else{
            table.table.style.left = "14vw";
        }
    }
    sidePanel.clickedSidePanel(shiftTable);

    const eachProperty = document.querySelectorAll(".each-property");
    eachProperty.forEach((element)=>{
        element.addEventListener("click", ()=>{
            table.updateAccordingTo(element.querySelectorAll(".property")[0].innerHTML, '#3266a8', '#b84646');
            eachProperty.forEach((element)=>{
                element.style.background = "transparent";
            });
            element.style.background = "#222";
        });
    })

    // ========================= On window resize ===========================
    window.addEventListener('resize', (event)=>{
        accordions.forEach((accordion) => {
            const canvas = accordion.canvasInstance;
            if (canvas) {
                canvas.updateCanvasSize();
                canvas.drawRectangles(canvas.rotationAngle);
            }
        });
        atomCanvas.updateCanvas();
    });
}