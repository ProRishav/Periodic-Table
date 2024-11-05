class SidePanel{
    constructor(divElement){
        this.sidePanelDiv = divElement;
        this.pannelToggle = true;
        this.panelArrow = document.querySelectorAll('#arrow')[0];
        this.checkEnterSidePanel = document.querySelectorAll('#enter-side-panel')[0];

        this.panelArrow.addEventListener('mouseenter', ()=>{this.enterSidePanel()});
        this.sidePanelDiv.addEventListener('mouseenter', ()=>{this.enterSidePanel()});
        this.checkEnterSidePanel.addEventListener('mouseenter', ()=>{this.enterSidePanel()});
        this.checkEnterSidePanel.addEventListener('mouseleave', ()=>{this.leaveSidePanel()});
        this.checkEnterSidePanel.addEventListener('dblclick', ()=>{this.toggleSidePannel()});
    }
    toggleSidePannel(){
        const sideOverlay = document.querySelectorAll('.side-overlay')[0];
        if (this.pannelToggle){
            this.sidePanelDiv.style.width = "18vw";
            sideOverlay.style.width = "0vw";
            this.pannelToggle = false;
        }else{
            this.sidePanelDiv.style.width = "0vw";
            sideOverlay.style.width = "3vw";
            this.pannelToggle = true;
        }
    }
    enterSidePanel(){
        if (this.pannelToggle){
            this.sidePanelDiv.style.width = "1vw";
        }
    }
    leaveSidePanel(){
        if (this.pannelToggle){
            this.sidePanelDiv.style.width = "0vw";
        }
    }
    clickedSidePanel(func){
        this.panelArrow.addEventListener('click', ()=>{
            func();
            this.toggleSidePannel();
        });
    }
}