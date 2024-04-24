export const AsyncAnimator = () => {
  const animations = new Map<
    AnimationID,
    {
      animationTimeMilliSecs: number;
      animation: () => void;
    }
  >();
  const timeoutIDs = new Set<number>();

  return {
    stopAnimations: () => {
      timeoutIDs.forEach((processID) => clearTimeout(processID));
      animations.clear();
    },

    queueAnimation: (
      animationID: AnimationID,
      animationTimeMilliSecs: number,
      animation: () => void
    ) => {
      if (animations.has(animationID)) {
        return;
      }

      animations.set(animationID, {
        animationTimeMilliSecs,
        animation,
      });
    },

    animate: (processToRunAfterAnimations: (() => void) | null = null) => {
      let totalAnimationTimeMilliSecs = 0;
      animations.forEach(({ animationTimeMilliSecs, animation: process }) => {
        const timeoutID = setTimeout(() => {
          process();
          timeoutIDs.delete(timeoutID);
          totalAnimationTimeMilliSecs -= animationTimeMilliSecs;
        }, totalAnimationTimeMilliSecs);

        totalAnimationTimeMilliSecs += animationTimeMilliSecs;
        timeoutIDs.add(timeoutID);
      });

      if (processToRunAfterAnimations) {
        setTimeout(() => {
          processToRunAfterAnimations();
        }, totalAnimationTimeMilliSecs);
      }

      animations.clear();
    },
  };
};

type AnimationID =
  | "ANIMATE_CLEAR_GRID"
  | "ANIMATE_VISITED_PATH"
  | "ANIMATE_SHORTEST_PATH";
