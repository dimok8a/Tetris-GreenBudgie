import Colorizable, {Color} from "./color.js";
import Figure from "./figure.js";
import Tetris from "./tetris.js";

export abstract class AbstractBlock implements Colorizable {
	protected x: number;
	protected y: number;
	
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	abstract getColor(): Color;

	/**
	 * Gets the real X section position of the current block on the field
	 */
	public abstract getFieldSectionX(): number;

	/**
	 * Gets the real Y section position of the current block on the field
	 */
	public abstract getFieldSectionY(): number;

	public draw() {
		const field = Tetris.instance.current_level.field;
		const context = Tetris.instance.context;
		const section_size = field.real_section_size;
		const start_x = field.getRealFieldX() + this.getFieldSectionX() * section_size + 0.5;
		const start_y = field.getRealFieldY() + this.getFieldSectionY() * section_size + 0.5;
		context.beginPath();
		context.moveTo(start_x, start_y);
		context.lineTo(start_x + section_size, start_y);
		context.lineTo(start_x + section_size, start_y + section_size);
		context.lineTo(start_x, start_y + section_size);
		context.closePath();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.fillStyle = this.getColor();
		context.stroke();
		context.fill();
	}
}

/**
 * Represents a block that takes place at the field
 */
export class FieldBlock extends AbstractBlock {

	public color: Color;

	public getColor(): Color {
		return this.color;
	}

	public moveDown() {
		this.y++;
	}

	public getFieldSectionX(): number {
		return this.x;
	}

	public getFieldSectionY(): number {
		return this.y;
	}

}

/**
 * Represents a block that is attached to a figure
 */
export class FigureBlock extends AbstractBlock {

	public figure: Figure;

	public getColor(): Color {
		return this.figure.color;
	}

	/**
	 * Checks whether the block is able to move right
	 * @returns ALLOW if the block is able to move right, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveRight(): MoveResult {
		return this.checkMove(1, 0);
	}

	/**
	 * Checks whether the block is able to move left
	 * @returns ALLOW if the block is able to move left, BOUNDARY if a wall obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveLeft(): MoveResult {
		return this.checkMove(-1, 0);
	}

	/**
	 * Checks whether the block is able to move down
	 * @returns ALLOW if the block is able to move down, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMoveDown(): MoveResult {
		return this.checkMove(0, 1);
	}

	/**
	 * Checks whether the block is able to move by specified deltas
	 * @returns ALLOW if the block is able to move by specified deltas, BOUNDARY if a floor obstructs the movement, BLOCK if a block obstructs the movement
	 */
	public checkMove(dx: number, dy: number): MoveResult {
		const field = Tetris.instance.current_level.field;
		const new_section_x = this.getFieldSectionX() + dx;
		const new_section_y = this.getFieldSectionY() + dy;
		for(const block of field.blocks) {
			if(new_section_x == block.getFieldSectionX() && new_section_y == block.getFieldSectionY()) return MoveResult.BLOCK;
		}
		if(field.isSectionInside(new_section_x, new_section_y)) return MoveResult.ALLOW;
		return MoveResult.BOUNDARY;
	}

	public getFieldSectionX(): number {
		return this.x + this.figure.section_x;
	}

	public getFieldSectionY(): number {
		return this.y + this.figure.section_y;
	}

	public checkRotation(): MoveResult {
		const field = Tetris.instance.current_level.field;
		const rotated_field_x = this.findRotatedRelativeX() + this.figure.section_x;
		const rotated_field_y = this.findRotatedRelativeY() + this.figure.section_y;
		if(!field.isSectionInside(rotated_field_x, rotated_field_y)) return MoveResult.BOUNDARY;
		for(const field_block of field.blocks) {
			if(field_block.getFieldSectionX() == rotated_field_x && field_block.getFieldSectionY() == rotated_field_y) return MoveResult.BLOCK;
		}
		return MoveResult.ALLOW;
	}

	public findRotatedRelativeX(): number {
		const origin_y = this.y - this.figure.rotation_center_y;
		const rotated_origin_x = -origin_y;
		return rotated_origin_x + this.figure.rotation_center_x;
	}

	public findRotatedRelativeY(): number {
		const origin_x = this.x - this.figure.rotation_center_x;
		const rotated_origin_y = origin_x;
		return rotated_origin_y + this.figure.rotation_center_y;
	}

	public rotateNoRestrictions() {
		const rotated_x = this.findRotatedRelativeX();
		const rotated_y = this.findRotatedRelativeY();
		this.x = rotated_x;
		this.y = rotated_y;
	}

	public getFigureRelativeX(): number {
		return this.x;
	}

	public getFigureRelativeY(): number {
		return this.y;
	}

	/**
	 * Creates a field block with the same coordinates and color
	 * @returns A new field block
	 */
	public toFieldBlock(): FieldBlock {
		const field_block = new FieldBlock(this.getFieldSectionX(), this.getFieldSectionY());
		field_block.color = this.getColor();
		return field_block;
	}

}

export enum MoveResult {
	/**
	 * Block is able to move
	 */
	ALLOW,
	/**
	 * Movement is obstructed by a wall or a floor
	 */
	BOUNDARY,
	/**
	 * Movement is obstucted by another block
	 */
	BLOCK
}