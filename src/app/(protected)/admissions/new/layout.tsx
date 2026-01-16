'use client';

import { useRef } from 'react';
import WizardStepper from './components/wizard/WizardStepper';
import WizardFooter from './components/wizard/WizardFooter';
import {
    WizardNextContext,
    WizardNextHandler,
} from './components/wizard/WizardNextContext';

export default function AdmissionWizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const nextHandlerRef = useRef<WizardNextHandler | null>(null);

    return (
        <WizardNextContext.Provider value={nextHandlerRef}>
            <WizardStepper />
            <main style={{ 
                padding: 14,
                backgroundColor: '#f5f5f5',
                boxShadow: 'inset 0 0 10px #0000001a',
                borderRadius: 8 }}>{children}</main>
            <WizardFooter nextHandlerRef={nextHandlerRef} />
        </WizardNextContext.Provider>
    );
}

//                 background: 'linear-gradient(90deg, #cdd5db7c 0%, #e0e0e06e 100%)',
