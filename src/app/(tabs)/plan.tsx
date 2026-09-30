import { EmptyState } from '@/components/EmptyState';
import { HubPage } from '@/components/HubPage';
import { Barbell, CalendarBlank, ForkKnife, Pill } from '@/components/icons';

/** Plan (docs/03, L-O). Builders and editors arrive in Milestone 4. */
export default function Plan() {
  return (
    <HubPage
      hub="plan"
      sections={{
        program: (
          <EmptyState
            icon={Barbell}
            title="No program yet"
            body="Pick a proven template or build your own week, and Today will load each day's workout."
          />
        ),
        nutrition: (
          <EmptyState
            icon={ForkKnife}
            title="No nutrition targets yet"
            body="Set calories, protein and water so your food log has something to aim for."
          />
        ),
        supplements: (
          <EmptyState
            icon={Pill}
            title="Nothing added yet"
            body="Keep your supplements, medications and devices in one place, with schedules and reminders."
          />
        ),
        thisweek: (
          <EmptyState
            icon={CalendarBlank}
            title="This week is empty"
            body="Once you have a program, each day's workout, cardio and check-in show here."
          />
        ),
        nextweek: (
          <EmptyState
            icon={CalendarBlank}
            title="Next week is empty"
            body="Plan ahead: next week's schedule appears here once your program is set."
          />
        ),
      }}
    />
  );
}
