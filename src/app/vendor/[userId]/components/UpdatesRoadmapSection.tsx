"use client";
import { useState } from "react";

interface Update {
  title: string;
  content: string;
  date: Date;
  type: 'release' | 'feature' | 'announcement' | 'roadmap';
  linkedinPosted?: boolean;
}

interface UpdatesRoadmapSectionProps {
  updates?: Update[];
  futureRoadmap?: string;
  userId: string;
}

export function UpdatesRoadmapSection({
  updates,
  futureRoadmap,
  userId,
}: UpdatesRoadmapSectionProps) {
  const [activeTab, setActiveTab] = useState<'updates' | 'roadmap'>('updates');

  const groupedUpdates = updates?.reduce((acc, update) => {
    const type = update.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(update);
    return acc;
  }, {} as Record<string, Update[]>);

  return (
    <section className="mb-16">
      <div className="flex border-b border-zinc-200 mb-6">
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'updates'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Updates & Releases
        </button>
        {futureRoadmap && (
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'roadmap'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Roadmap
          </button>
        )}
      </div>

      {activeTab === 'updates' && updates && updates.length > 0 && (
        <div className="space-y-6">
          {groupedUpdates && Object.entries(groupedUpdates).map(([type, typeUpdates]) => (
            <div key={type}>
              <h3 className="text-xl font-semibold text-zinc-900 mb-4 capitalize">
                {type === 'release' ? 'Recent Releases' : 
                 type === 'feature' ? 'New Features' :
                 type === 'announcement' ? 'Announcements' : 'Roadmap Updates'}
              </h3>
              <div className="space-y-4">
                {typeUpdates
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((update, idx) => (
                    <div 
                      key={idx}
                      className="p-6 bg-white rounded-lg border border-zinc-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-zinc-900">{update.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-zinc-500">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                          {update.linkedinPosted && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              Posted on LinkedIn
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-zinc-700 whitespace-pre-line">{update.content}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roadmap' && futureRoadmap && (
        <div className="p-6 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-lg border border-zinc-200">
          <h3 className="text-xl font-semibold text-zinc-900 mb-4">Future Roadmap</h3>
          <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{futureRoadmap}</p>
        </div>
      )}

      {activeTab === 'updates' && (!updates || updates.length === 0) && (
        <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
          <p className="text-zinc-600">No updates available yet.</p>
        </div>
      )}
    </section>
  );
}

