import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppearanceSettings } from '@/components/AppearanceSettings';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { HubPage } from '@/components/HubPage';
import { Target, User } from '@/components/icons';
import { Text } from '@/components/Text';
import { space } from '@/theme/tokens';

/** Profile (docs/03, U). Account settings arrive in step 8 of this milestone. */
export default function Profile() {
  return (
    <HubPage
      hub="profile"
      sections={{
        profile: (
          <EmptyState
            icon={User}
            title="Your profile"
            body="Your photo, level, rank and how far you've come since you started."
          />
        ),
        goals: (
          <EmptyState
            icon={Target}
            title="No goals set yet"
            body="Your event date, goal weight and daily targets live here."
          />
        ),
        settings: (
          <View style={styles.stack}>
            <Text variant="title3">Appearance</Text>
            <Card>
              <AppearanceSettings />
            </Card>
            {__DEV__ && (
              <Button
                variant="link"
                label="Component gallery"
                onPress={() => router.push('/gallery')}
              />
            )}
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({ stack: { gap: space.md } });
