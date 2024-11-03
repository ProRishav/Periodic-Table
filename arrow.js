class ArrowCanvas {
    constructor(canvas) {
        this.arrowCanvas = canvas[0];
        this.rotationAngle = -45;
        this.targetAngle = 45;
        this.isRotating = false;
        this.defaultColor = '#bebebe';
        this.hoverColor = 'aliceblue';
        this.currentColor = this.defaultColor;
        this.updateCanvasSize();
        this.ctx = this.arrowCanvas.getContext('2d');
        this.arrowCanvas.style.background = 'transparent';
        this.animateRotation = this.animateRotation.bind(this);
        this.accordionSubheader = this.arrowCanvas.parentElement;
        if (this.accordionSubheader) {
            this.accordionSubheader.addEventListener('mouseenter', () => {
                this.currentColor = this.hoverColor;
                this.drawRectangles(this.rotationAngle);
            });
            this.accordionSubheader.addEventListener('mouseleave', () => {
                this.currentColor = this.defaultColor;
                this.drawRectangles(this.rotationAngle);
            });
        }
    }

    updateCanvasSize() {
        this.vw = window.innerWidth / 100;
        this.arrowCanvas.width = 0.8 * this.vw;
        this.arrowCanvas.height = 0.8 * this.vw;
        this.height = 0.667 * this.arrowCanvas.width;
        this.width = this.height / 4;
        this.radius = this.arrowCanvas.width / 15;
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawRectangles(angle) {
        this.ctx.clearRect(0, 0, this.arrowCanvas.width, this.arrowCanvas.height);
        this.ctx.save();
        this.ctx.translate(this.arrowCanvas.width / 2 - this.arrowCanvas.width / 5, this.arrowCanvas.height / 2);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.fillStyle = this.currentColor;
        this.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.radius);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.arrowCanvas.width / 2 + this.arrowCanvas.width / 5, this.arrowCanvas.height / 2);
        this.ctx.rotate(-angle * Math.PI / 180);
        this.ctx.fillStyle = this.currentColor;
        this.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.radius);
        this.ctx.restore();
    }

    animateRotation() {
        if (Math.abs(this.targetAngle - this.rotationAngle) < 0.01) {
            this.rotationAngle = this.targetAngle;
            this.isRotating = false;
            return;
        }
        this.rotationAngle += (this.targetAngle - this.rotationAngle) * 0.3;
        this.drawRectangles(this.rotationAngle);
        requestAnimationFrame(this.animateRotation);
    }
}

const accordions = document.querySelectorAll('.accordion');
function closeAllAccordions(exceptAccordion) {
    accordions.forEach((accordion) => {
        if (accordion !== exceptAccordion) {
            const contentDiv = accordion.querySelector('.content');
            contentDiv.style.height = '0px';
            const canvasInstance = accordion.canvasInstance;
            if (canvasInstance) {
                canvasInstance.targetAngle = -45;
                canvasInstance.isRotating = true;
                canvasInstance.animateRotation();
            }
        }
    });
}

accordions.forEach((accordion) => {
    const arrowCanvas = accordion.querySelectorAll('.arrowCanvas');
    const canvas = new ArrowCanvas(arrowCanvas);
    accordion.canvasInstance = canvas;
    accordion.addEventListener('click', (event) => {
        const isHeaderClick = event.target.closest('.accordion-header');
        if (!isHeaderClick) return;
        if (canvas.isRotating) return;
        const contentDiv = accordion.querySelector('.content');
        if (contentDiv.style.height === '20vw') {
            contentDiv.style.height = '0px';
            canvas.targetAngle = -45;
        } else {
            closeAllAccordions(accordion);
            contentDiv.style.height = '20vw';
            canvas.targetAngle = 45;
        }
        canvas.isRotating = true;
        canvas.animateRotation();
    });
    canvas.drawRectangles(canvas.rotationAngle);
});

