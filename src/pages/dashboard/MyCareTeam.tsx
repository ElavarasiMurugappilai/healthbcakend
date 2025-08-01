import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Phone, MessageCircle, Video } from 'lucide-react';

type CareTeamMember = {
  name: string;
  role: string;
  img: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
};

interface MyCareTeamProps {
  filteredCareTeam: CareTeamMember[];
  setSelectedMember: (member: CareTeamMember | null) => void;
  setShowCareTeamModal: (show: boolean) => void;
}

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block ml-2 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5h-6.586a1.5 1.5 0 0 0-1.06.44l-2.47 2.47A.75.75 0 0 1 8.25 18V16.5H4.5A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25Z" />
  </svg>
);

const MyCareTeam: React.FC<MyCareTeamProps> = ({
  filteredCareTeam,
  setSelectedMember,
  setShowCareTeamModal,
}) => {
  const [chatMember, setChatMember] = useState<CareTeamMember | null>(null);
  const [team, setTeam] = useState(filteredCareTeam);
  const [showAllModal, setShowAllModal] = useState(false);

  // When chatMember is set, mark as read
  useEffect(() => {
    if (chatMember) {
      setTeam(prev => prev.map(m => m.name === chatMember.name ? { ...m, unread: false, badge: undefined } : m));
    }
  }, [chatMember]);

  return (
    <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-[420px]">
      <Card className="w-full h-full min-h-[420px] flex flex-col shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              My Care Team
              <span className="relative flex items-center">
                {team.some(m => m.badge && m.unread) && (
                  <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5 ml-2">2</span>
                )}
                <MessageIcon />
              </span>
            </CardTitle>
            <Button
              variant="link"
              className="text-xs sm:text-sm p-0 text-left"
              onClick={() => setShowAllModal(true)}
            >
              See all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ul className="space-y-3 h-full flex flex-col justify-start overflow-y-auto">
            {team.slice(0, -1).map((member) => (
              <li
                key={member.name}
                className="flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-accent rounded transition px-2 py-2 relative"
                onClick={() => setChatMember(member)}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  {member.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm sm:text-base text-left truncate">{member.name}</div>
                  <div className="text-xs text-gray-500 text-left truncate">{member.role}</div>
                </div>
                {member.badge && member.unread && (
                  <span className="bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5 ml-auto">
                    {member.badge}
                  </span>
                )}
                </div>
                {/* Quick Contact Icons on the right */}
                <div className="flex gap-2 ml-auto">
                  <button
                    title="Call"
                    className="hover:bg-blue-50 rounded p-1 transition"
                    onClick={e => { e.stopPropagation(); alert(`Calling ${member.name}...`); }}
                  >
                    <span role="img" aria-label="Call">📞</span>
                  </button>
                  <button
                    title="Message"
                    className="hover:bg-blue-50 rounded p-1 transition"
                    onClick={e => { e.stopPropagation(); setChatMember(member); }}
                  >
                    <span role="img" aria-label="Message">💬</span>
                  </button>
                  <button
                    title="Video Call"
                    className="hover:bg-blue-50 rounded p-1 transition"
                    onClick={e => { e.stopPropagation(); alert(`Starting video call with ${member.name}...`); }}
                  >
                    <span role="img" aria-label="Video">📹</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Chat Modal */}
      {chatMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px] max-w-xs w-full border dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800 ">
            <div className="flex items-center gap-3 mb-4 ">
              <img src={chatMember.img} alt={chatMember.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-bold text-base dark:text-white">{chatMember.name}</div>
                <div className="text-xs text-gray-500">{chatMember.role}</div>
              </div>
            </div>
            <div className="mb-4 max-h-40 overflow-y-auto">
              {chatMember.messages && chatMember.messages.length > 0 ? (
                chatMember.messages.map((msg, idx) => (
                  <div key={idx} className="bg-blue-100 text-blue-800 rounded px-3 py-2 mb-2 text-sm">
                    {msg}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No messages yet.</div>
              )}
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
              onClick={() => setChatMember(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* See All Modal */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-[320px] max-w-xs w-full border dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
            <div className="font-bold text-lg mb-4">All Care Team Members</div>
            <ul className="space-y-3">
              {team.map((member) => (
                <li key={member.name} className="flex items-center gap-3">
                  <img src={member.img} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="text-left">
                    <div className="font-medium text-sm text-left">{member.name}</div>
                    <div className="text-xs text-gray-500 text-left">{member.role}</div>
                    {member.messages && member.messages.length > 0 && (
                      <div className="text-xs text-blue-500 mt-1 text-left">Messages: {member.messages.length}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
              onClick={() => setShowAllModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCareTeam; 