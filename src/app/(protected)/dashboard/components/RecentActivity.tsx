'use client';

import React, { useEffect, useState } from 'react';
import { getPayments } from '@/services/api';
import { Payment } from '@/lib/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function RecentActivity() {
  const [activities, setActivities] = useState<Payment[]>([]);

  useEffect(() => {
    getPayments().then(data => {
      // Just taking the top 5 payments as recent activity for now
      setActivities(data.slice(0, 5));
    });
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-[18px] font-medium text-primary mb-4">Recent Payments</h3>
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {activity.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-primary">{activity.customerName}</p>
                <p className="text-[12px] text-on-surface-variant">Paid via {activity.paymentMethod}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-semibold text-green-600">+₹{activity.amount.toLocaleString()}</p>
              <p className="text-[12px] text-on-surface-variant">{dayjs(activity.date).fromNow()}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-[14px] text-on-surface-variant text-center py-4">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
