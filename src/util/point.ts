/**
 * Utility class that represents a pair of coordinates.
 * The point is mutable, use clone() to create a new point.
 */
export default class Point {

    private _x: number;
    private _y: number;

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * Creates a new point with coordinates set to zero
     */
    public static zero(): Point {
        return new Point(0, 0);
    }

    /**
     * Creates a copy of the current point
     */
    public clone(): Point {
        return new Point(this.x, this.y);
    }

    get x(): number {
        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    get y(): number {
        return this._y;
    }

    set y(y: number) {
        this._y = y;
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public setPositionTo(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }

    public moveBy(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    /**
     * Gets the SQUARED distance between this point and another one
     */
    public distanceSq(point: Point): number {
        const xDiff = this.x - point.x;
        const yDiff = this.y - point.y;
        return xDiff * xDiff + yDiff * yDiff;
    }

    /**
     * Gets the distance between this point and another one
     */
    public distance(point: Point): number {
        return Math.sqrt(this.distanceSq(point));
    }

    /**
     * Rotates the point by the specified angle around the origin
     * @param angleInRadians Angle in radians
     * @param origin A point to rotate the current point around
     */
    public rotate(angleInRadians: number, origin: Point) {
        const angleSin = Math.sin(angleInRadians);
        const angleCos = Math.cos(angleInRadians);
        this.x -= origin.x;
        this.y -= origin.y;
        const rotatedX = this.x * angleCos - this.y * angleSin;
        const rotatedY = this.x * angleSin + this.y * angleCos;
        this.x = rotatedX + origin.x;
        this.y = rotatedY + origin.y;
    }

}

export class PointArray {

    private points: Point[] = [];

    public static begin(x: number, y: number): PointArray {
        return new PointArray().add(x, y);
    }

    public add(x: number, y: number): PointArray {
        this.points.push(new Point(x, y));
        return this;
    }

    public build(): Point[] {
        return this.points;
    }
    
}

export interface Positionable {

    get position(): Point;

}