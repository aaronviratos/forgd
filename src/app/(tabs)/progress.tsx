import { EmptyState } from '@/components/EmptyState';
import { HubPage } from '@/components/HubPage';
import { CalendarBlank, ChartLineUp, Ruler, TestTube } from '@/components/icons';

/** Progress (docs/03, P-T). Charts and entry screens arrive in Milestone 4. */
export default function Progress() {
  return (
    <HubPage
      hub="progress"
      sections={{
        overview: (
          <EmptyState
            icon={ChartLineUp}
            title="Your progress starts here"
            body="Log a few mornings and your weight trend, averages and habits appear here."
          />
        ),
        measurements: (
          <EmptyState
            icon={Ruler}
            title="No measurements yet"
            body="Waist, arms and other spots every 2 to 4 weeks show change the scale can miss."
          />
        ),
        charts: (
          <EmptyState
            icon={ChartLineUp}
            title="No charts yet"
            body="Weight, blood pressure and recovery charts fill in as you log."
          />
        ),
        checkin: (
          <EmptyState
            icon={CalendarBlank}
            title="No check-ins yet"
            body="Once a week, save your waist, photos and notes. Your week's numbers fill in for you."
          />
        ),
        labs: (
          <EmptyState
            icon={TestTube}
            title="No bloodwork yet"
            body="Add lab results to see which markers are in range and track them over time."
          />
        ),
      }}
    />
  );
}
