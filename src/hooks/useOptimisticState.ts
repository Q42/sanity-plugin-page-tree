import { useEffect, useState, Dispatch, SetStateAction } from 'react';

export const useOptimisticState = <S>(state: S): [S, Dispatch<SetStateAction<S | null>>] => {
  const [optimisticState, setOptimisticState] = useState<S | null>(null);

  useEffect(() => {
    if (optimisticState === state) {
      setOptimisticState(null);
    }
  }, [state, optimisticState]);

  return [optimisticState ?? state, setOptimisticState];
};
