import Sidebar from "./Sidebar";

const SidebarContainer = () => {
  const items = [
    { id: 1, label: "Dashboard" },
    { id: 2, label: "Datasets" },
    { id: 3, label: "Models" },
    { id: 4, label: "Results" },
    { id: 5, label: "About" }
  ];

  return <Sidebar items={items} />;
};

export default SidebarContainer;