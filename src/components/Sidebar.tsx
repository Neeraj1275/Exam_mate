import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Settings,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <GraduationCap size={27} />
        <span>ExamMate</span>
      </div>

      <p className="nav-heading">WORKSPACE</p>

      <nav className="navigation">
        <div className="nav-item active">
          <LayoutDashboard size={19} />
          Dashboard
        </div>

        <div className="nav-item">
          <BookOpen size={19} />
          Subjects
        </div>

        <div className="nav-item">
          <FileText size={19} />
          Question Bank
        </div>
      </nav>

      <div className="sidebar-bottom">
        <Settings size={19} />
        Settings
      </div>
    </aside>
  );
}

export default Sidebar;
