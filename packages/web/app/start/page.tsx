import { StartTopbar } from '@/components/onboarding/start-topbar';
import { StartWizard } from '@/components/onboarding/start-wizard';

export default function StartPage() {
  return (
    <main className="funnel-shell">
      <StartTopbar />
      <StartWizard />
    </main>
  );
}
