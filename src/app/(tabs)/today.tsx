import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { HubPage } from '@/components/HubPage';
import {
  Barbell,
  ClipboardText,
  ForkKnife,
  Heartbeat,
  Pill,
  Scales,
  Warning,
} from '@/components/icons';
import { Text } from '@/components/Text';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

/** Today (docs/03, E). Logging forms arrive in Milestone 3. */
export default function Today() {
  return (
    <HubPage
      hub="today"
      sections={{
        checklist: (
          <EmptyState
            icon={ClipboardText}
            title="Nothing on today's list yet"
            body="Once your plan is set, today's workout, meals and supplements show up here as a checklist."
          />
        ),
        morning: (
          <EmptyState
            icon={Scales}
            title="Log your morning"
            body="Weight, sleep and how you feel. It takes under a minute."
          />
        ),
        nutrition: (
          <EmptyState
            icon={ForkKnife}
            title="No food logged today"
            body="Log meals to see calories and protein against your targets."
          />
        ),
        training: (
          <EmptyState
            icon={Barbell}
            title="No workout logged"
            body="Start a workout and repeat last time's sets with one tap each."
          />
        ),
        cardio: (
          <EmptyState
            icon={Heartbeat}
            title="No cardio or steps yet"
            body="Log cardio sessions and steps to build Endurance and Stamina."
          />
        ),
        supplements: (
          <EmptyState
            icon={Pill}
            title="No supplements set up"
            body="Add what you take, then check it off each day."
          />
        ),
        flags: <RedFlags />,
      }}
    />
  );
}

/** Safety guidance is shown from day one, before the symptom picker exists. */
function RedFlags() {
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      <View
        role="alert"
        style={[styles.alert, { backgroundColor: colors.badSoft, borderLeftColor: colors.bad }]}
      >
        <Text variant="overline" tone="bad">
          Emergency
        </Text>
        <Text variant="bodyStrong">
          Chest pain, trouble breathing, fainting, or one-sided calf swelling?
        </Text>
        <Text>Call 911 or go to the nearest emergency room now.</Text>
      </View>
      <EmptyState
        icon={Warning}
        title="No symptoms logged"
        body="If something feels wrong, log it here so you can show your doctor."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.lg },
  alert: { borderLeftWidth: 5, borderRadius: radius.input, padding: space.lg, gap: space.xs },
});
