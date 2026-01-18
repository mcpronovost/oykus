import { Bell, Mail, Smile } from "lucide-react";

export default function AppHeaderNotifications() {
  return (
    <section className="oyk-app-header-notifications">
      <div className="oyk-app-header-notifications-group">
        <button className="oyk-app-header-notifications-button">
          <Bell size={18} />
        </button>
      </div>
      <div className="oyk-app-header-notifications-group">
        <button className="oyk-app-header-notifications-button">
          <Smile size={18} />
        </button>
      </div>
      <div className="oyk-app-header-notifications-group">
        <button className="oyk-app-header-notifications-button">
          <Mail size={18} />
        </button>
      </div>
    </section>
  );
}
