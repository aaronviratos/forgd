/**
 * Sign in with an emailed code (docs/07, decision 2): enter your email, get a 6-digit
 * code, type it in. New emails create an account; existing ones sign in. No passwords
 * to forget, reset or leak.
 */
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field, Input } from '@/components/Field';
import { Text } from '@/components/Text';
import { Wordmark } from '@/components/Wordmark';
import { backendConfigured } from '@/config/backend';
import { supabase } from '@/data/supabase';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_AFTER_S = 60;

/** Plain-language versions of Supabase's sign-in errors. */
function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('rate limit') || m.includes('security purposes')) {
    return 'Too many codes asked for. Wait a minute, then try again.';
  }
  if (m.includes('expired') || m.includes('invalid')) {
    return 'That code did not work. Check it, or send a new one.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'No connection. Check your signal and try again.';
  }
  return 'Something went wrong. Try again.';
}

export default function SignIn() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [wait, setWait] = useState(0);

  // Countdown before a new code can be sent.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.replace(/\D/g, '');

  const sendCode = async () => {
    if (!EMAIL.test(cleanEmail)) {
      setError('Enter your email address, like name@example.com');
      return;
    }
    setBusy(true);
    setError(undefined);
    const { error: e } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (e) return setError(friendly(e.message));
    setStep('code');
    setCode('');
    setWait(RESEND_AFTER_S);
  };

  const verify = async () => {
    if (cleanCode.length < 6) {
      setError('Enter the 6-digit code from the email.');
      return;
    }
    setBusy(true);
    setError(undefined);
    const { error: e } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: 'email',
    });
    setBusy(false);
    // On success the app switches to Home by itself (the session changes).
    if (e) setError(friendly(e.message));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.page, { paddingTop: insets.top + space.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: colors.plate }]}>
            <Wordmark size={34} />
          </View>
          <Text variant="title2" center>
            Build yourself.
          </Text>
          <Text tone="muted" center>
            Every workout, meal and night of sleep levels up your card.
          </Text>
        </View>

        <Card raised>
          {!backendConfigured() ? (
            <Text tone="warn">
              Sign-in is not set up yet: the Supabase key and PowerSync address still need to be
              added in src/config/backend.ts.
            </Text>
          ) : step === 'email' ? (
            <>
              <Text variant="title3">Sign in or create an account</Text>
              <Field
                label="Email"
                hint="We'll email you a 6-digit code. No password needed."
                error={error}
              >
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={sendCode}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="send"
                  invalid={!!error}
                />
              </Field>
              <Button
                variant="primary"
                label="Email me a code"
                block
                loading={busy}
                onPress={sendCode}
              />
            </>
          ) : (
            <>
              <Text variant="title3">Check your email</Text>
              <Text tone="muted">
                We sent a code to <Text variant="bodyStrong">{cleanEmail}</Text>. It works for 1
                hour.
              </Text>
              <Field label="Code" error={error}>
                <Input
                  label="Code"
                  value={code}
                  onChangeText={setCode}
                  onSubmitEditing={verify}
                  placeholder="123456"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  maxLength={10}
                  returnKeyType="done"
                  invalid={!!error}
                  autoFocus
                />
              </Field>
              <Button variant="primary" label="Sign in" block loading={busy} onPress={verify} />
              <View style={styles.row}>
                <Button
                  variant="link"
                  label={wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
                  disabled={wait > 0 || busy}
                  onPress={sendCode}
                />
                <Button
                  variant="link"
                  label="Use a different email"
                  onPress={() => {
                    setStep('email');
                    setError(undefined);
                  }}
                />
              </View>
            </>
          )}
        </Card>

        <Text variant="small" tone="muted" center>
          Not medical advice. In an emergency, call 911.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { padding: space.gutter, gap: space.xl, paddingBottom: space.xxxl * 2 },
  brand: { alignItems: 'center', gap: space.sm, paddingBottom: space.sm },
  mark: {
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderRadius: 18,
    marginBottom: space.sm,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: space.sm },
});
