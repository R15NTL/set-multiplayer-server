export type Color = "red" | "green" | "purple";
export type Shape = "oval" | "diamond" | "snake";
export type Quantity = 1 | 2 | 3;
export type Shading = "solid" | "empty" | "shaded";

export type Card = {
  color: Color;
  shape: Shape;
  quantity: Quantity;
  shade: Shading;
  arrId: number;
};
