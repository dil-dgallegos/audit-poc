import {
  AppSwitcherSidePanel,
  Helper,
  KeyboardShortcutPanel,
  LaunchPadLink,
  User,
} from '@diligentcorp/atlas-react-global-nav';
import GlobalNav from '@diligentcorp/atlas-react-global-nav';
import { appsData, componentData, orgData, resourceLinksData } from './data';
const diligentUrl = 'https://www.diligent.com';

export function Nav(): JSX.Element {
  return (
    <GlobalNav locale="en">
      <AppSwitcherSidePanel
        organizations={orgData}
        componentData={componentData}
        apps={appsData}
        initialOrganizationId={1}
        resourceLinks={resourceLinksData}
      />
      <LaunchPadLink launchpadUrl={diligentUrl} orgName="Pied Piper" />
      <Helper helpDocUrl="https://www.google.com" supportUrl="https://www.google.com" />
      <User
        customerName="Galvanize Inc"
        enableProfile={true}
        username="User Name"
        userProfileUrl={diligentUrl}
        logoutUrl={diligentUrl}
      />
      <KeyboardShortcutPanel appId="default" />
    </GlobalNav>
  );
}

export * from './data';
