import React, { useState, useEffect } from "react";
import API from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type CareTeamMember = {
  _id?: string;
  name: string;
  role?: string;
  specialization?: string;
  img?: string;
  photo?: string;
  badge?: number;
  unread?: boolean;
  messages?: string[];
  rating?: number;
  experience?: number;
};

interface MyCareTeamProps {
  selectedDoctors?: CareTeamMember[];
  setSelectedMember?: (member: CareTeamMember | null) => void;
  setShowCareTeamModal?: (show: boolean) => void;
}

const MyCareTeam: React.FC<MyCareTeamProps> = ({
  selectedDoctors: propSelectedDoctors
}) => {
  const [chatMember, setChatMember] = useState<CareTeamMember | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<CareTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch selected doctors from backend
  useEffect(() => {
    const fetchSelectedDoctors = async () => {
      try {
        const response = await API.get('/doctors/selected');
        if (response.data.success) {
          setSelectedDoctors(response.data.data.selectedDoctors || []);
        }
      } catch (error) {
        console.error('Failed to fetch selected doctors:', error);
        // Fallback to prop data if API fails
        setSelectedDoctors(propSelectedDoctors || []);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedDoctors();
  }, [propSelectedDoctors]);

  // Use fetched doctors or prop data
  const team = selectedDoctors?.length ? selectedDoctors : [];

  return (
    <div className="flex-1 min-w-0 mb-2 lg:mb-0 h-[420px]">
      <Card className="h-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            My Care Team
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading care team...</p>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No doctors selected yet.</p>
              <p className="text-sm text-gray-400 mt-2">Complete the quiz to select your care team.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {team.slice(0, 3).map((member: CareTeamMember, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                      <AvatarImage src={member.img || member.photo} alt={member.name} />
                      <AvatarFallback className="text-xs sm:text-sm font-medium">
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {member.role || member.specialization}
                      </p>
                      {member.rating && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-yellow-500">★</span>
                          <span className="text-xs text-gray-600 ml-1">{member.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {member.badge && member.badge > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                        {member.badge}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Message"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={(e) => { e.stopPropagation(); setChatMember(member); }}
                    >
                      <Icons.messageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {team.length > 3 && (
                <Button
                  variant="outline"
                  className="w-full mt-3 text-sm"
                  onClick={() => setShowAllModal(true)}
                >
                  View All ({team.length} members)
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Modal */}
      <Dialog open={!!chatMember} onOpenChange={() => setChatMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat with {chatMember?.name}</DialogTitle>
          </DialogHeader>
          {chatMember && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chatMember.img || chatMember.photo} alt={chatMember.name} />
                  <AvatarFallback>
                    {chatMember.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{chatMember.name}</p>
                  <p className="text-sm text-gray-500">{chatMember.role || chatMember.specialization}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Chat functionality coming soon...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Show All Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Care Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {team.map((member: CareTeamMember, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.img || member.photo} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.role || member.specialization}
                    </p>
                    {member.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-xs text-gray-600 ml-1">{member.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {member.badge && member.badge > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {member.badge}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setChatMember(member)}
                  >
                    <Icons.messageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCareTeam;