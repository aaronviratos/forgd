import { EmptyState } from '@/components/EmptyState';
import { Sparkle } from '@/components/icons';
import { Screen } from '@/components/Screen';

/** Coach (docs/03, D). The AI chat arrives in Milestone 5. */
export default function Coach() {
  return (
    <Screen title="Coach">
      <EmptyState
        icon={Sparkle}
        title="Hey, I'm your coach"
        body="I'll see your training, food, sleep and labs, and tell you what to do next. Coming in a later update."
      />
    </Screen>
  );
}
