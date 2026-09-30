import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppearanceSettings } from '@/components/AppearanceSettings';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { HubPage } from '@/components/HubPage';
import { Target, User } from '@/components/icons';
import { Text } from '@/components/Text';
import { useData } from '@/data/DataProvider';
import { space } from '@/theme/tokens';

/** Profile (docs/03, U). Account settings arrive in step 8 of this milestone. */
export default function Profile() {
  const { session, signOut } = useData();
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
            {session ? (
              <>
                <Text variant="title3">Account</Text>
                <Card>
                  <Text tone="muted">Signed in as</Text>
                  <Text variant="bodyStrong">{session.user.email}</Text>
                  <Button label="Sign out" onPress={signOut} />
                  <Text variant="small" tone="muted">
                    Signing out removes your data from this phone. It stays safe in your account.
                  </Text>
                </Card>
              </>
            ) : null}
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
