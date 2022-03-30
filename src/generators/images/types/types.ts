import type { Canvas } from "canvas";

type ImageGenerator<T = any> = (data: T, location: string, canvas: Canvas) => Promise<void>;

export type { ImageGenerator };
