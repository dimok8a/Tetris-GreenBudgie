import Colorizable, {Color} from "../game/color.js";
import Tetris from "../game/tetris.js";
import Processable from "../util/processable.js";

export default abstract class MenuButton implements Colorizable, Processable {

    public readonly blockSize = 100;
    public readonly shape = this.getShape();
    public readonly shapeWidth = this.getShapeWidth(); 
    public readonly shapeHeight = this.getShapeHeight(); 

    public abstract getColor(): Color;
    public abstract onClick(): void;
    public abstract getText(): string;
    public abstract getIndex(): number;
    public abstract getShape(): ButtonShape;

    private getShapeWidth(): number {
        let maxX = 0;
        for(const blockPos of this.shape) {
            if(blockPos.x > maxX) maxX = blockPos.x;
        }
        return maxX + 1;
    }

    private getShapeHeight(): number {
        let maxY = 0;
        for(const blockPos of this.shape) {
            if(blockPos.y > maxY) maxY = blockPos.y;
        }
        return maxY + 1;
    }

    public click(): void {
        this.onClick();
    }

    public update(delta: number): void {
        
    }

    public draw(context: CanvasRenderingContext2D): void {
        const centerX = Tetris.instance.WINDOW_WIDTH / 2;
        const centerY = Tetris.instance.WINDOW_HEIGHT / 2;
        const startX = centerX - this.blockSize * this.shapeWidth / 2;
        const startY = centerY - this.blockSize * this.shapeHeight / 2;
        
        context.strokeStyle = "black";
        context.lineWidth = 4;
        context.lineCap = "square";
        context.fillStyle = this.getColor();
        
        for(const blockPos of this.shape) {
            const currentStartX = startX + blockPos.x * this.blockSize;
            const currentStartY = startY + blockPos.y * this.blockSize;
            context.beginPath();
            context.moveTo(currentStartX, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY);
            context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY + this.blockSize);
            context.lineTo(currentStartX, currentStartY);
            context.fill();

            context.beginPath();
            context.moveTo(currentStartX, currentStartY);

            if(this.isFree(blockPos, 0, -1)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY);
            }

            if(this.isFree(blockPos, 1, 0)) {
                context.lineTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX + this.blockSize, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, 0, 1)) {
                context.lineTo(currentStartX, currentStartY + this.blockSize);
            } else {
                context.moveTo(currentStartX, currentStartY + this.blockSize);
            }

            if(this.isFree(blockPos, -1, 0)) {
                context.lineTo(currentStartX, currentStartY);
            }

            context.stroke();
        }
        
    }

    private isFree(blockPos: {x: number, y: number}, dx: number, dy: number) {
        return !this.shape.some(pos => pos.x == blockPos.x + dx && pos.y == blockPos.y + dy);
    }

}

export type ButtonShape = {x: number, y: number}[];