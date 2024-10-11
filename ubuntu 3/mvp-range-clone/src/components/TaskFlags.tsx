'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface TaskFlagsProps {
  taskId: number;
}

interface Flag {
  id: number;
  name: string;
  color: string;
  selected?: boolean;
}

const TaskFlags: React.FC<TaskFlagsProps> = ({ taskId }) => {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [selectedFlags, setSelectedFlags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Flag[]>(`${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/api/v1/tasks/${taskId}/flags`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
          },
        });
        setFlags(response.data);
        setSelectedFlags(response.data.filter(flag => flag.selected).map(flag => flag.id));
      } catch (err) {
        setError('Failed to fetch flags. Please try again.');
        console.error('Error fetching flags:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, [taskId]);

  const handleFlagToggle = async (flagId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL}/api/v1/tasks/${taskId}/flag`, {
        flagId: flagId,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      setSelectedFlags(prev =>
        prev.includes(flagId) ? prev.filter(id => id !== flagId) : [...prev, flagId]
      );
    } catch (err) {
      setError('Failed to update flag. Please try again.');
      console.error('Error updating flag:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Task Flags</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center space-x-2">
                <Switch
                  id={`flag-${flag.id}`}
                  checked={selectedFlags.includes(flag.id)}
                  onCheckedChange={() => handleFlagToggle(flag.id)}
                />
                <Label htmlFor={`flag-${flag.id}`}>{flag.name}</Label>
              </div>
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskFlags;
