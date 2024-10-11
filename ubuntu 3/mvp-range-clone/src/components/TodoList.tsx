'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  is_team_task: boolean;
  flag: 'none' | 'blocked' | 'high_priority';
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTeamTask, setIsTeamTask] = useState(false);
  const [taskFlag, setTaskFlag] = useState<'none' | 'blocked' | 'high_priority'>('none');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
        },
      });
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/tasks`,
        {
          title: newTask,
          is_team_task: isTeamTask,
          flag: taskFlag
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask('');
      setIsTeamTask(false);
      setTaskFlag('none');
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (taskId: number, done: boolean) => {
    try {
      await axios.put(
        `${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/tasks/${taskId}`,
        { done },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
          },
        }
      );
      setTasks(tasks.map(task => task.id === taskId ? { ...task, done } : task));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const updateTaskFlag = async (taskId: number, flag: 'none' | 'blocked' | 'high_priority') => {
    try {
      await axios.put(
        `${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/tasks/${taskId}`,
        { flag },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
          },
        }
      );
      setTasks(tasks.map(task => task.id === taskId ? { ...task, flag } : task));
    } catch (err) {
      setError('Failed to update task flag');
      console.error('Error updating task flag:', err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col mb-4">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="mb-2"
          />
          <div className="flex items-center mb-2">
            <Switch
              id="team-task"
              checked={isTeamTask}
              onCheckedChange={setIsTeamTask}
            />
            <Label htmlFor="team-task" className="ml-2">Team Task</Label>
          </div>
          <div className="flex items-center mb-2">
            <Label htmlFor="task-flag" className="mr-2">Flag:</Label>
            <Select value={taskFlag} onValueChange={(value) => setTaskFlag(value as 'none' | 'blocked' | 'high_priority')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a flag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="high_priority">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addTask}>Add Task</Button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={() => toggleTask(task.id, !task.done)}
                  className="mr-2"
                />
                <span className={task.done ? 'line-through' : ''}>
                  {task.title}
                  {task.is_team_task && <Badge variant="outline" className="ml-2">Team</Badge>}
                </span>
              </div>
              <Select
                value={task.flag}
                onValueChange={(value) => updateTaskFlag(task.id, value as 'none' | 'blocked' | 'high_priority')}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Flag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Flag</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="high_priority">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TodoList;
