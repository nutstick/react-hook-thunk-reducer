import { useCallback, useRef, useState } from 'react';

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 *
 * @param {Function} reducer
 * @param {any} initialArg
 * @param {Function} [init]
 * @returns {Array}
 */
function useThunkReducer(reducer, initialArg, init = (a) => a) {
  const [state, setHookState] = useState(init(initialArg));

  const stateRef = useRef(state);
  const getState = useCallback(() => stateRef.current);
  const setState = useCallback((newState) => {
    stateRef.current = newState;
    setHookState(newState);
  });

  const reduce = useCallback((action) => reducer(getState(), action));
  const thunkDispatch = useCallback((action) => (
    typeof action === 'function'
      ? action(thunkDispatch, getState)
      : setState(reduce(action))
  ));

  return [state, thunkDispatch];
}

export default useThunkReducer;
