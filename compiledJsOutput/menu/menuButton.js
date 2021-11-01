import RGBColor from "../color/rgbColor.js";
import Tetris from "../game/tetris.js";
import Menu from "./menu.js";
export default class MenuButton {
    constructor(index) {
        this.blockSize = 85;
        this.shape = this.getShape();
        this.shapeWidth = this.getShapeWidth();
        this.shapeHeight = this.getShapeHeight();
        this.x = this.blockSize;
        this.textCenterX = this.x + this.getTextCenterPosition().x * this.blockSize;
        this.grayColor = RGBColor.grayscale(200);
        this.index = index;
        const startY = Tetris.instance.WINDOW_HEIGHT / 2 - this.blockSize * this.shapeHeight / 2;
        this.y = startY + (index - 1) * this.blockSize * 1.5;
        this.textCenterY = this.y + this.getTextCenterPosition().y * this.blockSize;
        this.currentColor = index == 0 ? this.getColor().clone() : this.grayColor.clone();
    }
    getShapeWidth() {
        let maxX = 0;
        for (const blockPos of this.shape) {
            if (blockPos.x > maxX)
                maxX = blockPos.x;
        }
        return maxX + 1;
    }
    getShapeHeight() {
        let maxY = 0;
        for (const blockPos of this.shape) {
            if (blockPos.y > maxY)
                maxY = blockPos.y;
        }
        return maxY + 1;
    }
    isCurrent() {
        return Menu.getMenu().currentButton == this;
    }
    onSelect() {
    }
    click() {
        this.onClick();
    }
    update(delta) {
    }
    draw(context) {
        this.drawFigure(context);
        this.drawText(context);
    }
    drawText(context) {
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = this.getTextSize() + "px ft_default";
        context.fillText(this.getText(), this.textCenterX, this.textCenterY);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeText(this.getText(), this.textCenterX, this.textCenterY);
    }
    drawFigure(context) {
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.currentColor.rgbString;
        for (const blockPos of this.shape) {
            const currentStartX = this.x + blockPos.x * this.blockSize;
            const currentStartY = this.y + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX - 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY - 1);
            context.lineTo(currentStartX + this.blockSize + 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY + this.blockSize + 1);
            context.lineTo(currentStartX - 1, currentStartY - 1);
            context.fill();
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            if (this.isFree(blockPos, 0, -1)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }
            if (this.isFree(blockPos, 1, 0)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, 0, 1)) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            }
            else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }
            if (this.isFree(blockPos, -1, 0)) {
                context.lineTo(currentStartX, currentStartY);
            }
            context.stroke();
        }
    }
    isFree(blockPos, dx, dy) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }
}
//# sourceMappingURL=menuButton.js.map