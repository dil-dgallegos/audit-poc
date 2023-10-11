/* eslint-disable camelcase */
// These are ordered by app creation, newest goes last
const appsData = [
  { key: 'projects', url: 'projects_url', title: 'Compliance Assessments' },
  { key: 'issue_tracker', url: 'issue_tracker_url', title: 'Issue Tracker' },
  { key: 'task_tracker', url: 'task_tracker_url', title: 'Task Tracker' },
  { key: 'project_timesheets', url: 'project_timesheets_url', title: 'Timesheets' },
  { key: 'mission_control', url: 'mission_control_url', title: 'Mission Control' },
  { key: 'reports', url: 'reports_url', title: 'Reports' },
  { key: 'results', url: 'results_url', title: 'Results' },
  { key: 'storyboards', url: 'storyboards_url', title: 'Storyboards' },
  { key: 'robots', url: 'robots_url', title: 'Robots' },
  { key: 'analytics', url: 'analytics_url', title: 'Analytics' },
  { key: 'strategy', url: 'strategy_url', title: 'Strategy' },
  { key: 'frameworks', url: 'frameworks_url', title: 'Frameworks' },
  { key: 'compliance_maps', url: 'compliance_maps_url', title: 'Compliance Maps' },
  { key: 'assurance_plans', url: 'assurance_plans_url', title: 'Assurance Plans' },
  { key: 'project_scheduler', url: 'project_scheduler_url', title: 'Scheduler' },
  { key: 'policy_training', url: 'policy_training_url', title: 'Policy Training' },
  { key: 'master_library', url: 'master_library_url', title: 'Master Library' },
  { key: 'asset_inventory', url: 'asset_inventory_url', title: 'Asset Inventory' },
  { key: 'activity_center', url: 'activity_center_url', title: 'Activity Center' },
  { key: 'risk_register', url: 'risk_register_url', title: 'Risk Register' },
  { key: 'risk_manager', url: 'risk_manager_url', title: 'Risk Manager' },
  { key: 'assessments', url: 'assessments_url', title: 'Assessments' },
  { key: 'asset_manager', url: 'asset_manager_url', title: 'Asset Manager' },
  { key: 'foo', url: 'foo', title: 'Test Foo App' },
  { key: 'new_bar', url: 'bar', title: 'Test Bar App' },
];

const orgData = [
  {
    id: 1,
    customerName: 'A great customer',
    name: 'a swell organization',
    launchpad: 'https://wegalvanize.com',
    logo: 'https://img.logoipsum.com/298.svg',
  },
  {
    id: 2,
    customerName: 'Galvanize',
    name: 'R&D',
    launchpad: 'https://wegalvanize.com/highbond/',
    logo: 'https://pbs.twimg.com/profile_images/1146099254261235712/lXyZoVxV_400x400.png',
  },
  {
    id: 3,
    customerName: 'Galvanize',
    name: 'Marketing',
    launchpad: 'https://wegalvanize.com/careers/',
    logo: '',
  },
  {
    id: 4,
    customerName: null,
    name: 'Irrelevant',
    launchpad: 'https://wegalvanize.com/careers/',
    logo: '',
  },
  {
    id: 5,
    customerName: null,
    name: 'Aperture',
    launchpad: 'https://wegalvanize.com/careers/',
    logo: '',
  },
];

const resourceLinksData = {
  launchpad: 'www.launchpad.ca',
  academy: 'www.academy.ca',
  community: 'www.community.ca',
};

const componentData = {
  foo: {
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDExLjIzNDJWMTIuODEzMkg1Ljk5OTk4VjExLjIzNDJIMy41OTk5OFYxMC40NDQ3SDUuMTk5OThWOC44NjU4SDYuNzk5OThWNy4yODY4NUgxMy4yVjguODY1OEgxNC44VjEwLjQ0NDdIMTYuNFYxMS4yMzQySDE0Wk0xNi40IDguODY1NzdWNy4yODY4M0gxNC44VjUuNzA3ODhIMTMuMlY0LjEyODkzSDExLjZWNS43MDc4OEg4LjRWNC4xMjg5M0g2LjhWNS43MDc4OEg1LjJWNy4yODY4M0gzLjZWOC44NjU3N0gyVjE1Ljk3MUgzLjZWMTIuODEzMUg0LjRWMTUuOTcxSDZWMTQuMzkyMUgxNFYxNS45NzFIMTUuNlYxMi44MTMxSDE2LjRWMTUuOTcxSDE4VjguODY1NzdIMTYuNFpNOS4yMDAyNCAxNS45NzFMNiAxNS45NzFMNi4wMDAyNCAxNy41NUg5LjIwMDI0VjE1Ljk3MVpNMTAuODAwMyAxNy41NUgxNC4wMDAzTDE0IDE1Ljk3MUwxMC44MDAzIDE1Ljk3MVYxNy41NVpNMTQuODAwMyAyLjU0OTk5SDEzLjIwMDNMMTMuMiA0LjEyODkzTDE0LjgwMDMgNC4xMjg5M1YyLjU0OTk5Wk01LjIwMDI4IDQuMTI4OTNMNi44IDQuMTI4OTNMNi44MDAyOCAyLjU0OTk5SDUuMjAwMjhWNC4xMjg5M1pNNi44MDAyOSAxMS4yMzQySDguNDAwMjlWOS42NTUyM0g2LjgwMDI5VjExLjIzNDJaTTExLjYwMDIgMTEuMjM0MkgxMy4yMDAyVjkuNjU1MjNIMTEuNjAwMlYxMS4yMzQyWiIgZmlsbD0iIzcxNzE3MSIvPgo8L3N2Zz4K',
    iconColor: '#42996D',
    section: 'setup',
  },
  new_bar: {
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDExLjIzNDJWMTIuODEzMkg1Ljk5OTk4VjExLjIzNDJIMy41OTk5OFYxMC40NDQ3SDUuMTk5OThWOC44NjU4SDYuNzk5OThWNy4yODY4NUgxMy4yVjguODY1OEgxNC44VjEwLjQ0NDdIMTYuNFYxMS4yMzQySDE0Wk0xNi40IDguODY1NzdWNy4yODY4M0gxNC44VjUuNzA3ODhIMTMuMlY0LjEyODkzSDExLjZWNS43MDc4OEg4LjRWNC4xMjg5M0g2LjhWNS43MDc4OEg1LjJWNy4yODY4M0gzLjZWOC44NjU3N0gyVjE1Ljk3MUgzLjZWMTIuODEzMUg0LjRWMTUuOTcxSDZWMTQuMzkyMUgxNFYxNS45NzFIMTUuNlYxMi44MTMxSDE2LjRWMTUuOTcxSDE4VjguODY1NzdIMTYuNFpNOS4yMDAyNCAxNS45NzFMNiAxNS45NzFMNi4wMDAyNCAxNy41NUg5LjIwMDI0VjE1Ljk3MVpNMTAuODAwMyAxNy41NUgxNC4wMDAzTDE0IDE1Ljk3MUwxMC44MDAzIDE1Ljk3MVYxNy41NVpNMTQuODAwMyAyLjU0OTk5SDEzLjIwMDNMMTMuMiA0LjEyODkzTDE0LjgwMDMgNC4xMjg5M1YyLjU0OTk5Wk01LjIwMDI4IDQuMTI4OTNMNi44IDQuMTI4OTNMNi44MDAyOCAyLjU0OTk5SDUuMjAwMjhWNC4xMjg5M1pNNi44MDAyOSAxMS4yMzQySDguNDAwMjlWOS42NTUyM0g2LjgwMDI5VjExLjIzNDJaTTExLjYwMDIgMTEuMjM0MkgxMy4yMDAyVjkuNjU1MjNIMTEuNjAwMlYxMS4yMzQyWiIgZmlsbD0iIzcxNzE3MSIvPgo8L3N2Zz4K',
    iconColor: '#853AB1',
    section: 'workspace',
  },
};

export { appsData, componentData, orgData, resourceLinksData };
