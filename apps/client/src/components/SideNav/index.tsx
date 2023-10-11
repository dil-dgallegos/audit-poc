import { HomeIcon, SettingsIcon } from '@diligentcorp/atlas-react-icons';
import { SideNav, useSideNavContext } from '@diligentcorp/atlas-react-side-nav';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { PropsWithChildren, useEffect } from 'react';

const navListItems = [
  {
    icon: <HomeIcon />,
    text: 'Dashboard',
    selected: true,
  },
  {
    icon: <SettingsIcon />,
    text: 'Settings',
  },
  /* {
    icon: (
      <Badge badgeContent={2}>
        <ListIcon width={24} height={24} />
      </Badge>
    ),
    text: 'Agenda',
  }, */
];

export function CustomSideNav(props: PropsWithChildren): JSX.Element {
  return (
    <SideNav
      drawer={
        <SideNav.Drawer>
          <SideNav.Header
            logoSrc={'customerLogo'}
            logoAlt="Customer logo"
            toggleButtonProps={{
              'aria-label': 'Toggle navigation',
            }}
          />
          <List>
            {navListItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemButton selected={item.selected}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.text}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <SideNav.Footer logoSrc={'diligentLogo'} logoAlt="Diligent logo" version="v1.0.0" />
        </SideNav.Drawer>
      }
    >
      {props.children}
    </SideNav>
  );
}
