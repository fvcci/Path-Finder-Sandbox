import { useContext } from "react";
import * as DimensionsContext from "../context/DimensionContext";
import assert from "assert";

export default function useDimensionsContext() {
  const dimensions = useContext(DimensionsContext.Context);
  assert(
    dimensions,
    "useDimensionsContext must be used with a Dimensions.Context"
  );
  return dimensions;
}
