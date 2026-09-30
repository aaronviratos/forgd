import { Redirect } from 'expo-router';

// Until the navigation shell (step 3) exists, open the component gallery.
export default function Index() {
  return <Redirect href="/gallery" />;
}
