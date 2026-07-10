/**
 * Standalone-точка входа для встраиваемого виджета.
 *
 * Сборка: `npm run build:widget` → `dist/trial-schedule.js`
 *
 * Встраивание (аналог LKWidgetTournamentSignup):
 * ```html
 * <div id="trial-schedule-root"></div>
 * <script src="/trial-schedule.js"></script>
 * <script>
 *   window.PadlhubTrialScheduleWidget.mount({
 *     targetId: 'trial-schedule-root',
 *     apiBaseUrl: 'https://your-backend.host' // необязательно
 *   });
 * </script>
 * ```
 */
import './styles/globals.css';
import api from './lib/mount';

const globalKey = 'PadlhubTrialScheduleWidget';

if (typeof window !== 'undefined') {
  const w = window as unknown as Record<string, unknown>;
  if (!w[globalKey]) {
    w[globalKey] = api;
  }
}

export default api;
