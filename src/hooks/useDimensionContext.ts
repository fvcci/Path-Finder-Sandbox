import { useContext } from "react";
import { assert } from "../lib/asserts";
import * as DimensionsContext from "../context/DimensionContext";

export default function useDimensionsContext() {
  const dimensions = useContext(DimensionsContext.Context);
  assert(
    dimensions,
    "useDimensionsContext must be used with a Dimensions.Context"
  );
  return dimensions;
}
