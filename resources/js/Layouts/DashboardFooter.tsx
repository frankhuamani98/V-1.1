import React, { useMemo } from "react";

interface DashboardFooterProps {
  appName?: string;
  companyName?: string;
  version?: string;
}

const defaultProps = Object.freeze({
  appName: "Rudolf Motor",
  companyName: "Team Choclitos",
  version: "1.0.2",
});

const DashboardFooter: React.FC<DashboardFooterProps> = (props) => {
  const { appName, companyName, version } = { ...defaultProps, ...props };

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-white text-center py-2 text-sm text-gray-400">
      <p>© {currentYear} {companyName}. Todos los derechos reservados.</p>
      <p>{appName} - Versión {version}</p>
    </footer>
  );
};

export default DashboardFooter;