import { useWeb3 } from "../contexts/Web3Context.jsx";

/**
 * Convenience hook that re-exports Web3Context values.
 * Components can import from this hook instead of the context directly.
 */
export function useWeb3Hook() {
  return useWeb3();
}

export default useWeb3Hook;
