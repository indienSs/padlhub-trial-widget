import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ScheduleWidget } from './components/ScheduleWidget';
import './styles/globals.css';

const target = document.getElementById('root');
if (target) {
  createRoot(target).render(
    <StrictMode>
      <ScheduleWidget />
    </StrictMode>,
  );
} else {
  // eslint-disable-next-line no-console
  console.error('[padlhub-trial-widget] элемент #root не найден');
}
