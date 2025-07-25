import { useRef, useEffect, useCallback } from 'react';

/**
 * コンポーネントのマウント状態を追跡し、安全な状態更新を提供するカスタムフック
 * アンマウント後の状態更新によるメモリリークとクラッシュを防止する
 */
export const useSafeState = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 安全な状態更新関数
   * コンポーネントがマウント状態の場合のみ状態更新を実行する
   * @param setter - 実行する状態更新関数
   */
  const safeSetState = useCallback((setter: () => void) => {
    if (isMountedRef.current) {
      setter();
    }
  }, []);

  return { safeSetState, isMounted: isMountedRef.current };
};
