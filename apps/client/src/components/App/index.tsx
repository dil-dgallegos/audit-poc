import styles from './App.module.scss';
import { AtlasThemeProvider } from '@diligentcorp/atlas-theme-mui';
import { starlingHybridThemeOptions } from '@diligentcorp/atlas-theme-mui-hb';
import { Nav } from '../GlobalNav';
import { CustomSideNav } from '../SideNav';

export function App() {
  return (
    <AtlasThemeProvider themeOptions={starlingHybridThemeOptions}>
      <CustomSideNav>
        <Nav />
        <div id="main">Main content div</div>
      </CustomSideNav>
    </AtlasThemeProvider>
  );
}
