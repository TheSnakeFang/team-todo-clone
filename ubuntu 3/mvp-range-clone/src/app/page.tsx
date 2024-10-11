'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DailyQuestion from '../components/DailyQuestion';
import Spinner from '../components/Spinner';
import TaskFlags from '../components/TaskFlags';
import TodoList from '../components/TodoList';

export default function Home() {
  // TODO: Replace these with actual project and task IDs from Vikunja API
  const projectId = 1;
  const taskId = 1;
  const userId = 1; // TODO: Replace this with actual user ID from authentication

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold">MVP Range Clone</h1>
      </header>
      <main className="flex-grow p-6">
        <Tabs defaultValue="todo-list" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todo-list">To-Do List</TabsTrigger>
            <TabsTrigger value="daily-question">Daily Question</TabsTrigger>
            <TabsTrigger value="team-spinner">Team Spinner</TabsTrigger>
            <TabsTrigger value="task-flags">Task Flags</TabsTrigger>
          </TabsList>
          <TabsContent value="todo-list">
            <Card>
              <CardHeader>
                <CardTitle>To-Do List</CardTitle>
              </CardHeader>
              <CardContent>
                <TodoList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="daily-question">
            <Card>
              <CardHeader>
                <CardTitle>Daily Question</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyQuestion projectId={projectId} userId={userId} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team-spinner">
            <Card>
              <CardHeader>
                <CardTitle>Team Spinner</CardTitle>
              </CardHeader>
              <CardContent>
                <Spinner projectId={projectId} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="task-flags">
            <Card>
              <CardHeader>
                <CardTitle>Task Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskFlags taskId={taskId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
