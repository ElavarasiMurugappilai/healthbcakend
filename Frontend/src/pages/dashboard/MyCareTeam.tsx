import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline-block ml-2 text-blue-500">
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
      <Card className="w-full h-full flex flex-col shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between pb-2 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-sm sm:text-base lg:text-lg flex items-center gap-2">
              My Care Team
              <span className="relative flex items-center">
                {team.some(m => m.badge && m.unread) && (
                  <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">2</Badge>
                )}
                <MessageIcon />
              </span>
            </CardTitle>
            <Button
              variant="link"
              className="text-xs sm:text-sm p-0 text-left h-auto"
              onClick={() => setShowAllModal(true)}
            >
              See all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-2 sm:p-3 lg:p-4 pb-2 sm:pb-3 lg:pb-4">
          <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2 h-full">
            {team.slice(0, 5).map((member) => (
              <li
                key={member.name}
                className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 cursor-pointer hover:bg-accent rounded-lg transition px-1.5 sm:px-2 py-1 sm:py-1.5 relative"
                onClick={() => setChatMember(member)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8">
                      <AvatarImage src={member.img} alt={member.name} />
                      <AvatarFallback className="text-xs sm:text-sm">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {member.unread && (
                      <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-red-500 border border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs sm:text-sm lg:text-base text-left truncate">{member.name}</div>
                    <div className="text-xs text-gray-500 text-left truncate">{member.role}</div>
                  </div>
                  {member.badge && member.unread && (
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                      {member.badge}
                    </Badge>
                  )}
                </div>
                {/* Quick Contact Icons on the right */}
                <div className="flex gap-0.5 sm:gap-1 lg:gap-1.5 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Call"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    onClick={e => { e.stopPropagation(); alert(`Calling ${member.name}...`); }}
                  >
                    <Icons.phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Message"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    onClick={e => { e.stopPropagation(); setChatMember(member); }}
                  >
                    <Icons.messageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Video Call"
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    onClick={e => { e.stopPropagation(); alert(`Starting video call with ${member.name}...`); }}
                  >
                    <Icons.video className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Chat Modal - Using shadcn Dialog */}
      <Dialog open={!!chatMember} onOpenChange={() => setChatMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with {chatMember?.name}</DialogTitle>
          </DialogHeader>
          {chatMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chatMember.img} alt={chatMember.name} />
                  <AvatarFallback>{chatMember.name}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-base">{chatMember.name}</div>
                  <div className="text-xs text-muted-foreground">{chatMember.role}</div>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {chatMember.messages && chatMember.messages.length > 0 ? (
                  chatMember.messages.map((msg, idx) => (
                    <div key={idx} className="bg-blue-100 text-blue-800 rounded px-3 py-2 text-sm">
                      {msg}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">No messages yet.</div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* See All Modal - Using shadcn Dialog */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>All Care Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ul className="space-y-3">
              {team.map((member) => (
                <li key={member.name} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.img} alt={member.name} />
                    <AvatarFallback>{member.name}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                    {member.messages && member.messages.length > 0 && (
                      <div className="text-xs text-blue-500 mt-1">Messages: {member.messages.length}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCareTeam; 