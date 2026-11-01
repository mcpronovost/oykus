import { IconLayoutGrid, IconSettings } from "@tabler/icons-react";

export default function OykCoreSidebar() {
  return (
    <div className="oyk-core-sidebar">
      <nav className="oyk-core-sidebar-nav">
        <ul className="oyk-core-sidebar-nav-list">
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link oyk-active">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconLayoutGrid />
                </span>
              </div>
            </div>
          </li>
        </ul>
        <ul className="oyk-core-sidebar-nav-list">
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconSettings />
                </span>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
