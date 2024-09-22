export default function assert(
  condition: unknown,
  message = ""
): asserts condition {
  if (!condition) throw Error(`Assert failed ${condition}: ${message}`);
}
