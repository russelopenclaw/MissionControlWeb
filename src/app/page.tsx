"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Agent {
  name: string;
  status: string;
  current_task: string;
  last_activity: string;
}

interface Task {
  id: string;
  title: string;
  column_name: string;
  assignee: string;
  priority: string;
}

interface TasksData {
  inProgress: Task[];
  backlog: Task[];
  done: Task[];
}

interface SystemStatus {
  ollama: boolean;
  gateway: boolean;
  disk: string;
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<TasksData>({ inProgress: [], backlog: [], done: [] });
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, these would call the actual API endpoints
    // For now, showing static data structure
    fetchDashboardData();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // These endpoints would connect to your PostgreSQL backend
      const [agentsRes, tasksRes, statusRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/tasks"),
        fetch("/api/status"),
      ]);

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        setAgents(agentsData);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSystemStatus(statusData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Mission Control</h1>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Live</span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* System Status Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Status
            </h2>
            {systemStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ollama</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${systemStatus.ollama ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {systemStatus.ollama ? '✓ Online' : '✗ Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gateway</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${systemStatus.gateway ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {systemStatus.gateway ? '✓ Online' : '✗ Offline'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Disk Space</span>
                  <span className="text-slate-200 font-mono text-sm">{systemStatus.disk}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No status data available</p>
            )}
          </div>

          {/* Agents Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agents ({agents.length})
            </h2>
            {agents.length > 0 ? (
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{agent.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        agent.status === 'working' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-600 text-slate-300'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    {agent.current_task && (
                      <p className="text-slate-400 text-sm truncate">{agent.current_task}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No active agents</p>
            )}
          </div>

          {/* Tasks Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tasks Overview
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg">
                <span className="text-slate-300 text-sm">Done</span>
                <span className="text-green-400 font-bold">{tasks.done?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg">
                <span className="text-slate-300 text-sm">In Progress</span>
                <span className="text-blue-400 font-bold">{tasks.inProgress?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                <span className="text-slate-300 text-sm">Backlog</span>
                <span className="text-slate-400 font-bold">{tasks.backlog?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">In Progress Tasks</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Task</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Assignee</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Priority</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.inProgress && tasks.inProgress.length > 0 ? (
                  tasks.inProgress.map((task) => (
                    <tr key={task.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-all">
                      <td className="py-3 px-4 text-slate-200">{task.title}</td>
                      <td className="py-3 px-4 text-slate-400 capitalize">{task.assignee}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-600 text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {task.column_name}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No tasks in progress
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          Mission Control Web Dashboard • Built with Next.js • Connected to PostgreSQL
        </div>
      </footer>
    </div>
  );
}
