import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BookOpen, ExternalLink } from 'lucide-react';
import { MOCK_RESOURCES } from '../data/mockData';

export const Resources: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Official Guides & Resources</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Explore references on PF claim withdrawals, UAN guidelines, and EPS pensions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_RESOURCES.map((resource) => (
          <Card key={resource.id} padded className="flex flex-col justify-between hover:border-neutral-300">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="primary">{resource.category}</Badge>
                <BookOpen className="w-4.5 h-4.5 text-neutral-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-800">{resource.title}</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {resource.link && (
              <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-end">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold focus:outline-none focus:underline"
                >
                  Visit Official Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
};
