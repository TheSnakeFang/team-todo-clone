'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase-client';

const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false });

interface SpinnerProps {
  projectId: number;
}

interface TeamMember {
  id: string;
  username: string;
}

const Spinner: React.FC<SpinnerProps> = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_URL;
  const apiToken = process.env.NEXT_[REDACTED SECRET]_VIKUNJA_API_TOKEN;

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/projects/${projectId}/members`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });
      setTeamMembers(response.data.map((member: TeamMember) => ({
        id: member.id.toString(),
        username: member.username
      })));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to fetch team members: ${err.response?.data?.message || err.message}`);
      } else {
        setError('Failed to fetch team members. Please try again.');
      }
      console.error('Error fetching team members:', err);
    }
  }, [projectId, apiUrl, apiToken]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const spinWheel = async () => {
    if (teamMembers.length === 0) {
      setError('No team members available to spin.');
      return;
    }

    setIsSpinning(true);
    setSelectedMember(null);
    setError(null);

    const randomIndex = Math.floor(Math.random() * teamMembers.length);
    setTimeout(async () => {
      const selected = teamMembers[randomIndex];
      setSelectedMember(selected);
      setIsSpinning(false);

      try {
        const { error } = await supabase
          .from('spinner_selections')
          .insert({
            project_id: projectId,
            selected_user_id: parseInt(selected.id),
            selected_user: selected.username,
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error storing spinner selection:', err);
      }
    }, 5000); // Spin for 5 seconds
  };

  const wheelData = teamMembers.map((member) => ({ option: member.username }));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Team Member Spinner</CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers.length > 0 ? (
          <div className="mb-4">
            <Wheel
              mustStartSpinning={isSpinning}
              prizeNumber={teamMembers.findIndex((member) => member.id === selectedMember?.id)}
              data={wheelData}
              onStopSpinning={() => setIsSpinning(false)}
              backgroundColors={['#ff8f43', '#70bbe0', '#0b3351', '#f9dd50']}
              textColors={['#ffffff']}
              outerBorderColor="#eeeeee"
              outerBorderWidth={10}
              innerRadius={0}
              innerBorderColor="#30261a"
              innerBorderWidth={0}
              radiusLineColor="#eeeeee"
              radiusLineWidth={0}
              fontSize={16}
              textDistance={60}
            />
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No team members available</p>
        )}
        <Button
          onClick={spinWheel}
          disabled={isSpinning || teamMembers.length === 0}
          className="w-full mb-4"
        >
          {isSpinning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Spin the Wheel'}
        </Button>
        {selectedMember && (
          <p className="text-lg font-semibold text-primary mb-4">
            Selected: {selectedMember.username}
          </p>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <h6 className="text-sm font-semibold mb-2">Team Members:</h6>
          <ul className="list-disc pl-5">
            {teamMembers.map((member) => (
              <li key={member.id}>{member.username}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Spinner;
