'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase-client';

interface DailyQuestionProps {
  projectId: number;
  userId: number;
}

interface Question {
  id: number;
  text: string;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ projectId, userId }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchQuestion = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('daily_question_responses')
        .select('question_id, question')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setQuestion({ id: data.question_id, text: data.question });
      } else {
        setQuestion({ id: 0, text: 'What is your main focus for today?' });
      }
    } catch (err) {
      console.error('Error fetching question:', err);
      setQuestion({ id: 0, text: 'What is your main focus for today?' });
      setError('Failed to fetch the daily question. Using a default question.');
    }
  }, [projectId]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('daily_question_responses')
        .insert({
          question_id: question?.id || 0,
          user_id: userId,
          project_id: projectId,
          question: question?.text || '',
          response: answer,
        });

      if (error) throw error;

      setSuccess(true);
      setAnswer('');
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to save response: ${err.message}`);
      } else {
        setError('Failed to save response. Please try again.');
      }
      console.error('Error saving response:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Daily Question</CardTitle>
      </CardHeader>
      <CardContent>
        {question && (
          <p className="text-lg font-semibold mb-4">{question.text}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit'}
          </Button>
        </form>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4">
            <AlertDescription>Response saved successfully!</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyQuestion;
