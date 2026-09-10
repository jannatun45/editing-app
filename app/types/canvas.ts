export type CanvasElementType = "text";

export type CanvasElement = {
  id: number;
  type: CanvasElementType;
  content: string;
  x: number;
  y: number;
};
