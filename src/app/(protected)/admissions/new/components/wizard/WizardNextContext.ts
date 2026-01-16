import { createContext, useContext } from 'react';

/**
 * Existing contract — DO NOT CHANGE
 */
export type WizardNextHandler = () => boolean;

/**
 * Keep context type EXACTLY the same
 * so all existing code continues to work
 */
export const WizardNextContext =
    createContext<React.MutableRefObject<WizardNextHandler | null> | null>(
        null
    );

/**
 * Existing hook — unchanged
 */
export const useWizardNext = () => useContext(WizardNextContext);
