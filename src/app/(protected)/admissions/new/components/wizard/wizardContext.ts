// wizardContext.ts
import { createContext, useContext } from 'react';

export const WizardNextContext = createContext<(() => void) | null>(null);

export const useWizardNext = () => useContext(WizardNextContext);
