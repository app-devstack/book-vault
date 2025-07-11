import { createConstate } from '@/components/providers/utils/constate';
import { useBookRegistration } from '@/hooks/screens/useBookRegistration';

const constate = createConstate(useBookRegistration);

export default function RegisterScreenProvider({ children }: { children: React.ReactNode }) {
  return <constate.Provider>{children}</constate.Provider>;
}
export const useRegisterContext = constate.useContextValue;
