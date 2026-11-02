import { IconLayoutGrid, IconBooks, IconNote, IconPencil, IconMessages, IconIcosahedron, IconAtom2, IconSettings } from "@tabler/icons-react";

export default function OykCoreSidebar() {
  return (
    <div className="oyk-core-sidebar">
      <nav className="oyk-core-sidebar-nav">
        <ul className="oyk-core-sidebar-nav-list">
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link oyk-active">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconLayoutGrid size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconBooks size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconNote size={24} stroke={1.5} />
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
                  <IconAtom2 size={24} stroke={2} />
                </span>
              </div>
            </div>
          </li>
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconPencil size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconMessages size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconIcosahedron size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
        </ul>
        <div className="oyk-core-sidebar-nav-spacer"></div>
        <ul className="oyk-core-sidebar-nav-list">
          <li className="oyk-core-sidebar-nav-list-item">
            <div className="oyk-core-sidebar-nav-link">
              <div className="oyk-core-sidebar-nav-link-content">
                <span className="oyk-core-sidebar-nav-link-icon">
                  <IconSettings size={24} stroke={1.5} />
                </span>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
