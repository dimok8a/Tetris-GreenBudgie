import StateHandler from "../state/StateHandler.js";
export class AbstractBlock {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    update(delta) { }
    draw(context) {
        const block_start_x = this.getRealX() + 0.5;
        const block_start_y = this.getRealY() + 0.5;
        this.prepareContextPath(block_start_x, block_start_y, context);
        this.fillBlock(this.getColor(), context);
        this.outlineBlock(context);
    }
    prepareContextPath(start_x, start_y, context) {
        const section_size = StateHandler.getHandler().GAME.level.field.real_section_size;
        context.beginPath();
        context.moveTo(start_x, start_y);
        context.lineTo(start_x + section_size, start_y);
        context.lineTo(start_x + section_size, start_y + section_size);
        context.lineTo(start_x, start_y + section_size);
        context.closePath();
    }
    outlineBlock(context) {
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
    }
    fillBlock(color, context) {
        context.fillStyle = color;
        context.fill();
    }
}
/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {
    constructor(x, y) {
        super(x, y);
        this.calculateRealX();
        this.calculateRealY();
    }
    getColor() {
        return this.color;
    }
    moveDown() {
        this.y++;
        this.calculateRealY();
    }
    getFieldSectionX() {
        return this.x;
    }
    getFieldSectionY() {
        return this.y;
    }
    calculateRealX() {
        const level = StateHandler.getHandler().GAME.level;
        this.realX = level.field.getRealFieldX() + this.getFieldSectionX() * level.field.real_section_size;
    }
    calculateRealY() {
        const level = StateHandler.getHandler().GAME.level;
        this.realY = level.field.getRealFieldY() + this.getFieldSectionY() * level.field.real_section_size;
    }
    getRealX() {
        return this.realX;
    }
    getRealY() {
        return this.realY;
    }
}
/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {
    getColor() {
        return this.figure.color;
    }
    /**
     * Checks whether the block is able to move right
     * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveRight() {
        return this.checkMove(1, 0);
    }
    /**
     * Checks whether the block is able to move left
     * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveLeft() {
        return this.checkMove(-1, 0);
    }
    /**
     * Checks whether the block is able to move down
     * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMoveDown() {
        return this.checkMove(0, 1);
    }
    /**
     * Checks whether the block is able to move by specified deltas
     * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
     */
    checkMove(dx, dy) {
        const field = StateHandler.getHandler().GAME.level.field;
        const new_section_x = this.getSectionX() + dx;
        const new_section_y = this.getSectionY() + dy;
        for (const block of field.blocks) {
            if (new_section_x == block.getFieldSectionX() && new_section_y == block.getFieldSectionY())
                return MoveResult.BLOCK;
        }
        if (field.isSectionInside(new_section_x, new_section_y))
            return MoveResult.ALLOW;
        return MoveResult.BOUNDARY;
    }
    getRealX() {
        const level = StateHandler.getHandler().GAME.level;
        return this.getSectionX() * level.field.real_section_size + level.field.getRealFieldX();
    }
    getRealY() {
        const level = StateHandler.getHandler().GAME.level;
        return this.getSectionY() * level.field.real_section_size + level.field.getRealFieldY();
    }
    getSectionX() {
        return this.x + this.figure.section_x;
    }
    getSectionY() {
        return this.y + this.figure.section_y;
    }
    getShadowSectionY() {
        return this.y + this.figure.getShadowSectionY();
    }
    getRealShadowY() {
        const level = StateHandler.getHandler().GAME.level;
        return level.field.getRealFieldY() + this.getShadowSectionY() * level.field.real_section_size;
    }
    checkRotation() {
        const field = StateHandler.getHandler().GAME.level.field;
        const rotated_field_x = this.findRotatedRelativeX() + this.figure.section_x;
        const rotated_field_y = this.findRotatedRelativeY() + this.figure.section_y;
        if (!field.isSectionInside(rotated_field_x, rotated_field_y))
            return MoveResult.BOUNDARY;
        for (const field_block of field.blocks) {
            if (field_block.getFieldSectionX() == rotated_field_x && field_block.getFieldSectionY() == rotated_field_y)
                return MoveResult.BLOCK;
        }
        return MoveResult.ALLOW;
    }
    findRotatedRelativeX() {
        const origin_y = this.y - this.figure.rotation_center_y;
        const rotated_origin_x = -origin_y;
        return rotated_origin_x + this.figure.rotation_center_x;
    }
    findRotatedRelativeY() {
        const origin_x = this.x - this.figure.rotation_center_x;
        const rotated_origin_y = origin_x;
        return rotated_origin_y + this.figure.rotation_center_y;
    }
    rotateNoRestrictions() {
        const rotated_x = this.findRotatedRelativeX();
        const rotated_y = this.findRotatedRelativeY();
        this.x = rotated_x;
        this.y = rotated_y;
    }
    getRelativeX() {
        return this.x;
    }
    getRelativeY() {
        return this.y;
    }
    getPreviewRealX() {
        return this.x * StateHandler.getHandler().GAME.level.field.real_section_size + this.figure.getPreviewRealX();
    }
    getPreviewRealY() {
        return this.y * StateHandler.getHandler().GAME.level.field.real_section_size + this.figure.getPreviewRealY();
    }
    /**
     * Creates a field block with the same coordinates and color
     * @returns A new field block
     */
    toFieldBlock() {
        const field_block = new FieldBlock(this.getSectionX(), this.getSectionY());
        field_block.color = this.getColor();
        return field_block;
    }
    drawAsPreview(context) {
        const startX = this.getPreviewRealX() + 0.5;
        const startY = this.getPreviewRealY() + 0.5;
        this.prepareContextPath(startX, startY, context);
        this.fillBlock(this.getColor(), context);
        this.outlineBlock(context);
    }
    draw(context) {
        super.draw(context);
    }
    drawShadow(context) {
        const shadow_section_y = this.getShadowSectionY();
        const current_section_y = this.getSectionY();
        if (shadow_section_y != current_section_y) {
            const shadow_real_x = this.getRealX() + 0.5;
            const shadow_real_y = this.getRealShadowY() + 0.5;
            this.prepareContextPath(shadow_real_x, shadow_real_y, context);
            this.fillBlock("rgb(230, 230, 230)", context);
            this.outlineBlock(context);
        }
    }
}
export var MoveResult;
(function (MoveResult) {
    /**
     * Block is able to move
     */
    MoveResult[MoveResult["ALLOW"] = 0] = "ALLOW";
    /**
     * Movement is obstructed by a wall or a floor
     */
    MoveResult[MoveResult["BOUNDARY"] = 1] = "BOUNDARY";
    /**
     * Movement is obstucted by another block
     */
    MoveResult[MoveResult["BLOCK"] = 2] = "BLOCK";
})(MoveResult || (MoveResult = {}));
//# sourceMappingURL=block.js.map