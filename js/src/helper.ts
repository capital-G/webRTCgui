import type { ControllerColor } from "./communication";

export function toCssColor(color: ControllerColor): string {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}
