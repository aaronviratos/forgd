import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/config/brand';

// Placeholder until the navigation shell (Milestone 1, step 3).
export default function Index() {
  return (
    <View style={styles.screen}>
      <Text style={styles.wordmark} accessibilityLabel={BRAND.name}>
        {BRAND.wordmark.main}
        <Text style={styles.accent}>{BRAND.wordmark.accent}</Text>
      </Text>
      <Text style={styles.note}>Foundation in progress</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24292B' },
  wordmark: { fontSize: 40, fontWeight: '800', color: '#ECE8DE', letterSpacing: 2 },
  accent: { color: '#FF6B1A' },
  note: { marginTop: 8, fontSize: 16, color: '#A2A69E' },
});
