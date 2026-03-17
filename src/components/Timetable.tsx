"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Plus, Loader2, Clock, BookOpen } from "lucide-react";

interface Task {
  id: string;
  subject: string;
  description: string;
  timeBlock: string;
  isCompleted: boolean;
}

export default function Timetable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [timeBlock, setTimeBlock] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/timetable");
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTask(true);
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, timeBlock }),
      });
      if (res.ok) {
        setSubject("");
        setDescription("");
        setTimeBlock("");
        setShowForm(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Add task error:", error);
    } finally {
      setAddingTask(false);
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/timetable/task/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !currentStatus } : t));
        // Note: Rewards are handled on the server.
      }
    } catch (error) {
      console.error("Toggle complete error:", error);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-24 bg-zinc-800 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Daily Study Plan</h2>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          variant="outline" 
          className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
        >
          {showForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Task</>}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-zinc-950 border-zinc-800 border-dashed animate-in fade-in slide-in-from-top-2">
          <CardContent className="p-6">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subject</label>
                  <Input 
                    required 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    placeholder="e.g. Physics" 
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Time Block</label>
                  <Input 
                    value={timeBlock} 
                    onChange={e => setTimeBlock(e.target.value)} 
                    placeholder="e.g. 4 PM - 5 PM" 
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Plan</label>
                <Input 
                  required 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="e.g. Solve Chapter 5 exercises" 
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <Button disabled={addingTask} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-12">
                {addingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className={`transition-all duration-300 ${task.isCompleted ? 'bg-zinc-950/50 border-emerald-500/10 opacity-60' : 'bg-zinc-900 border-zinc-800'}`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <button 
                onClick={() => toggleComplete(task.id, task.isCompleted)}
                className={`flex-shrink-0 transition-colors ${task.isCompleted ? 'text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {task.isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 uppercase tracking-tighter">
                    {task.subject}
                  </span>
                  {task.timeBlock && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {task.timeBlock}
                    </div>
                  )}
                </div>
                <p className={`font-medium truncate ${task.isCompleted ? 'text-zinc-500 line-through' : 'text-white'}`}>
                  {task.description}
                </p>
              </div>

              {!task.isCompleted && (
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+50 XP</p>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">+10 COINS</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && !showForm && (
          <div className="text-center p-12 bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl group cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => setShowForm(true)}>
            <div className="inline-flex p-4 bg-zinc-950 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-zinc-600 group-hover:text-violet-500 transition-colors" />
            </div>
            <p className="text-zinc-500 font-medium">No tasks for today. Start planning your battle!</p>
          </div>
        )}
      </div>
    </div>
  );
}
