import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Bell, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';

export const Track: React.FC = () => {
  const [ticketId, setTicketId] = useState('');
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const triggerMockReminder = async () => {
    setReminderStatus('sending');
    setReminderError(null);
    try {
      // Trigger API endpoint which returns HTTP 501 in Phase 0
      await apiService.sendReminder('GRV-MOCK-77192');
      setReminderStatus('success');
    } catch (err: any) {
      setReminderStatus('idle');
      // Set the 501 message as expected Phase 0 placeholder feedback
      setReminderError(err.message || 'Error occurred while calling reminder API.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Search Section */}
      <Card>
        <h2 className="text-xl font-bold text-neutral-900">Track Grievance Status</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Enter your simulated SunoGov reference ticket number (e.g. GRV-MOCK-77192) to monitor updates.
        </p>

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="e.g. GRV-MOCK-77192"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="flex-1"
          />
          <Button variant="primary" disabled className="px-4">
            <Search className="w-4 h-4 mr-1.5" />
            Track
          </Button>
        </div>
      </Card>

      {/* Mock Ticket Status Panel */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-neutral-400">Grievance Ticket ID</span>
            <h3 className="text-lg font-bold text-neutral-800 font-mono">GRV-MOCK-77192</h3>
          </div>
          <Badge variant="warning">IN_PROGRESS</Badge>
        </div>

        {/* Timeline representation */}
        <div className="mt-6 space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
          
          <div className="relative">
            <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-accent-500 ring-4 ring-accent-50"></div>
            <div>
              <p className="text-sm font-bold text-neutral-800">Grievance Registered</p>
              <p className="text-xs text-neutral-500">Aug 25, 2026 at 10:30 AM</p>
              <p className="text-xs text-neutral-600 mt-1">Simulated ticket record successfully established.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-primary-500 ring-4 ring-primary-50"></div>
            <div>
              <p className="text-sm font-bold text-neutral-800">Under Review</p>
              <p className="text-xs text-neutral-500">Aug 26, 2026 at 02:15 PM</p>
              <p className="text-xs text-neutral-600 mt-1">Assigned to simulated EPFO regional claims desk.</p>
            </div>
          </div>
        </div>

        {/* Send Reminder Action Mock */}
        <div className="mt-8 pt-5 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-semibold">No response from desk?</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={triggerMockReminder}
              disabled={reminderStatus === 'sending'}
              className="gap-1.5"
            >
              <Bell className="w-4 h-4" />
              Send Reminder
            </Button>
          </div>

          {reminderError && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs flex items-start gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Endpoint Placeholder Result (Expected):</p>
                <p className="mt-0.5">{reminderError}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
