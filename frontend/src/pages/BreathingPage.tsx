import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import './BreathingPage.css';

type BreathingPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
const phases: Record<BreathingPhase, {label:string; duration:number}>={
    inhale: { label: 'Inhale', duration: 4 },
    holdIn: { label: 'Hold', duration: 4 },
    exhale: { label: 'Exhale', duration: 4 },
    holdOut: { label: 'Hold', duration: 4 },
}

const phaseOrder: BreathingPhase[] = [
  'inhale',
  'holdIn',
  'exhale',
  'holdOut',
];



function BreathingPage() {
    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [secondsRemaining, setSecondsRemaining] = useState(phases.inhale.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            return;
        }
        if (secondsRemaining > 0) {
            const timer = window.setTimeout(() => {
                setSecondsRemaining((previous) => previous - 1);
            }, 1000);

            return () => window.clearTimeout(timer);
        }

        const currentIndex = phaseOrder.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phaseOrder.length;
        const nextPhase = phaseOrder[nextIndex];

        setPhase(nextPhase);
        setSecondsRemaining(phases[nextPhase].duration);
    }, [secondsRemaining, phase, isRunning]);

    const handleReset = () => {
    setIsRunning(false);
    setHasStarted(false);
    setPhase('inhale');
    setSecondsRemaining(phases.inhale.duration);
    setResetKey((previous) => previous + 1);
};
    return (
        

        <main className="breathing-page">
            <section className="breathing-container">
                <Link to="/" className="breathing-back-link">
                    ← Back to Fears
                </Link>
                <p className="breathing-eyebrow">Breathing Exercise</p>
                <h1>Box Breathing</h1>
                <p className="breathing-intro">
                    Follow a simple four part breathing cycle at your own pace.
                </p>
                <div className={`breathing-circle breathing-circle--${phase} ${ hasStarted ? 'breathing-circle--running' : ''} ${isRunning ? '' : 'breathing-circle--paused'}`} key={resetKey}>
                    <p>{phases[phase].label}</p>
                    <span>{secondsRemaining}</span>
                </div>
                <div className="breathing-phases">
                    {phaseOrder.map((currentPhase, index) => (
                    <div
                        key={currentPhase}
                        className={`breathing-phase ${
                            phase === currentPhase ? 'breathing-phase--active' : ''
                        }`}
                    >
                        <span className="breathing-phase-number">
                        {index + 1}
                        </span>
                        <span>{phases[currentPhase].label}</span>
                    </div>
                    ))}
                </div>

                <div className="breathing-controls">
                    <button type="button" onClick={() => {
                    setHasStarted(true);
                    setIsRunning((previous) => !previous);
                    }}>
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button type="button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </section>
        </main>
    );
}

export default BreathingPage;