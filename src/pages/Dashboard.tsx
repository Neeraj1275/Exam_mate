import { Upload, ArrowUpRight, Search } from "lucide-react";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import UploadSection from "../components/UploadSection";
import { stats, subjects } from "../data/mockData";

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <h1>Dashboard</h1>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <span>Student</span>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <p className="eyebrow">YOUR STUDY WORKSPACE</p>
            <h2>Prepare smarter, not harder.</h2>
            <p>
              Analyze previous papers and focus on the questions that matter.
            </p>
          </div>

          <button className="primary-button" type="button">
            <Upload size={18} />
            Upload Papers
          </button>
        </section>
        <UploadSection />
        <section className="stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Your Subjects</h2>
              <p>Choose a subject to explore its question bank.</p>
            </div>

            <button className="text-button" type="button">
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="subject-grid">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject.id}>
                <div
                  className="subject-icon"
                  style={{ backgroundColor: subject.color }}
                >
                  <Search size={21} />
                </div>

                <span className="subject-code">{subject.code}</span>

                <h3>{subject.name}</h3>

                <div className="subject-footer">
                  <span>{subject.questionCount} questions</span>
                  <ArrowUpRight size={18} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">
          ExamMate · Your personal exam preparation workspace
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
