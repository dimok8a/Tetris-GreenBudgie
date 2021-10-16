import Block, {MoveResult} from "./block.js";
import InputHandler, {KeyBindings} from "./input_handler.js";

/**
 * A figure is a collection of single blocks.
 * The figure itself does not contain a location, the blocks do. 
 */
export default class Figure {
	private blocks: Block[];
	private falling: boolean;
	private color: FigureColor;

	/**
	 * Creates a figure based on section coordinates.
	 * 0, 0 represents the top-left corner of the figure.
	 * @param sections An array of tuples in which the first element is relative section x, the second is relative section y coordinate
	 * @example An input "[0, 0], [1, 0], [2, 0], [1, 1]" will create a T-shaped figure
	 * @returns A figure with currently defined blocks
	 */
	public static createByRelativeBlockSections(...sections: [number, number][]): Figure {
		const blocks: Block[] = [];
		for(let section of sections) {
			blocks.push(new Block(section[0], section[1]));
		}
		return new Figure(...blocks);
	}

	constructor(...blocks: Block[]) {
		this.blocks = blocks;
		this.selectRandomColor();
	}

	private selectRandomColor() {
		let colors: FigureColor[] = [];
		for(const figureColor in FigureColor) {
			colors.push(FigureColor[figureColor]);
		}
		this.color = colors[Math.floor(Math.random() * colors.length)];
		this.blocks.forEach(block => block.color = this.color);
	}

	public moveRight() {
		this.moveIfPossibleOrStop(1, 0);
	}

	public moveLeft() {
		this.moveIfPossibleOrStop(-1, 0);
	}

	public moveDownOrStop() {
		this.moveIfPossibleOrStop(0, 1);
	}

	/**
	 * Moves all blocks of the figure by the specified deltas.
	 * Vertical movement obstruction will interrupt figure falling.
	 * Horizontal movement obstruction will not interrupt the falling, but the figure won't be moved.
	 * @param dx X movement, from -1 to 1
	 * @param dy Y movement, from -1 to 1
	 */
	public moveIfPossibleOrStop(dx: number, dy: number) {
		const isVerticalMovement = dy > 0;
		for(const block of this.blocks) {
			const moveResult = block.checkMove(dx, dy);
			if(moveResult != MoveResult.ALLOW) {
				if(isVerticalMovement) this.stop();
				return;
			}
		}
		this.moveNoRestrictions(dx, dy);
	}

	/**
	 * Moves all blocks of the figure by the specified deltas ignoring movement restrictions.
	 * @param dx X movement
	 * @param dy Y movement
	 */
	public moveNoRestrictions(dx: number, dy: number) {
		for(const block of this.blocks) {
			block.move(dx, dy);
		}
	}

	/**
	 * Interrupts the falling
	 */
	public stop() {

	}

	public update() {
		this.movementHandle();
	}

	private movementHandle() {
		if(InputHandler.getHandler().isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_LEFT)) {
			this.moveLeft();
		}
		if(InputHandler.getHandler().isKeyBindingPressedOrRepeats(KeyBindings.FIGURE_MOVE_RIGHT)) {
			this.moveRight();
		}
	}

	public draw() {
		for(let block of this.blocks) {
			block.draw();
		}
	}

}

export enum FigureColor {
	RED = "rgb(255, 86, 86)",
	GREEN = "rgb(132, 255, 92)",
	BLUE = "rgb(73, 63, 251)",
	PINK = "rgb(254, 102, 255)",
	YELLOW = "rgb(255, 251, 97)",
	ORANGE = "rgb(255, 151, 70)"
}