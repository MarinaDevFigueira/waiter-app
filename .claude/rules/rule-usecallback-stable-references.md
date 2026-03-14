## useCallback for Stable References
Use for: props to children, deps in hooks, event handlers closing over state.
If function doesn't close over state, declare at module scope.