export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface DinoTabPanelProps {
  panels: { Label: React.ReactNode, Component: React.ReactNode }[],
  currentTab?: number
}