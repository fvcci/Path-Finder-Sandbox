export function assert(
  condition: unknown,
  message: string = ""
): asserts condition {
  if (!condition) throw Error("Assert failed: " + message);
}
