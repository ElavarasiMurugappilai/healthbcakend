import React, { useState, useEffect } from "react";
import API from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Pill } from "lucide-react";

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

type MedicationSuggestion = {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
    photo?: string;
  };
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
};

interface MyCareTeamProps {
  selectedDoctors?: CareTeamMember[];
  setSelectedMember?: (member: CareTeamMember | null) => void;
  setShowCareTeamModal?: (show: boolean) => void;
  onMedicationAccepted?: (medication: {
    name: string;
    dosage: string;
    status: string;
    time: string;
  }) => void;
}

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 inline-block ml-2 text-blue-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5h-6.586a1.5 1.5 0 0 0-1.06.44l-2.47 2.47A.75.75 0 0 1 8.25 18V16.5H4.5A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25Z" />
  </svg>
);

const MyCareTeam: React.FC<MyCareTeamProps> = ({
  selectedDoctors: propSelectedDoctors,
  setSelectedMember,
  setShowCareTeamModal,
  onMedicationAccepted, // <-- add this
}) => {
  const [chatMember, setChatMember] = useState<CareTeamMember | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<CareTeamMember[]>([]);
  const [medicationSuggestions, setMedicationSuggestions] = useState<MedicationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatNotification, setChatNotification] = useState<string | null>(null);

  // Fetch selected doctors and medication suggestions from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch selected doctors
        const doctorsResponse = await API.get('/doctors/selected');
        if (doctorsResponse.data.success) {
          setSelectedDoctors(doctorsResponse.data.data.selectedDoctors || []);
        }

        // Fetch medication suggestions
        const suggestionsResponse = await API.get('/care-team/suggestions');
        if (suggestionsResponse.data.success) {
          setMedicationSuggestions(suggestionsResponse.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to prop data if API fails
        setSelectedDoctors(propSelectedDoctors || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propSelectedDoctors]);

  // Handle medication suggestion acceptance
  const handleAcceptSuggestion = async (suggestionId: string) => {
    try {
      const response = await API.patch(`/medications/suggestions/${suggestionId}/accept`);
      if (response.data.success) {
        toast.success(response.data.message);

        // Find the suggestion details
        const suggestion = medicationSuggestions.find(s => s._id === suggestionId);
        if (suggestion && onMedicationAccepted) {
          onMedicationAccepted({
            name: suggestion.medicationName,
            dosage: suggestion.dosage,
            status: "Upcoming",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          setChatNotification(`Medication "${suggestion.medicationName}" added to your schedule!`);
          setTimeout(() => setChatNotification(null), 2000);
        }

        // Update local state
        setMedicationSuggestions(prev => 
          prev.map(s => s._id === suggestionId ? { ...s, status: 'accepted', respondedAt: new Date().toISOString() } : s)
        );
      }
    } catch (error) {
      console.error('Error accepting medication:', error);
      toast.error('Failed to accept medication');
    }
  };

  // Handle medication suggestion rejection
  const handleRejectSuggestion = async (suggestionId: string, reason?: string) => {
    try {
      const response = await API.patch(`/medications/suggestions/${suggestionId}/reject`, { reason });
      if (response.data.success) {
        toast.success(response.data.message);
        // Update local state
        setMedicationSuggestions(prev => 
          prev.map(s => s._id === suggestionId ? { ...s, status: 'rejected', respondedAt: new Date().toISOString() } : s)
        );
      }
    } catch (error) {
      console.error('Error rejecting medication:', error);
      toast.error('Failed to reject medication');
    }
  };

  // When chatMember is set, mark as read
  useEffect(() => {
    if (chatMember) {
      setSelectedDoctors(prev => prev.map(m => 
        m.name === chatMember.name ? { ...m, unread: false, badge: undefined } : m
      ));
    }
  }, [chatMember]);

  // Use fetched doctors or prop data
  const team = selectedDoctors?.length ? selectedDoctors : [];

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
            <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2 h-full">
              {team.slice(0, 5).map((member: CareTeamMember, index: number) => (
                <li
                  key={member._id || index}
                  className="flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 cursor-pointer hover:bg-accent rounded-lg transition px-1.5 sm:px-2 py-1 sm:py-1.5 relative"
                  onClick={() => setChatMember(member)}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8">
                        <AvatarImage src={member.img || member.photo} alt={member.name} />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {member.unread && (
                        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 bg-red-500 border border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm lg:text-base text-left truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500 text-left truncate">
                        {member.role || member.specialization}
                      </div>
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
                      onClick={e => { 
                        e.stopPropagation(); 
                        alert(`Calling ${member.name}...`); 
                      }}
                    >
                      <Icons.phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Message"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={e => { 
                        e.stopPropagation(); 
                        setChatMember(member); 
                      }}
                    >
                      <Icons.messageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Video Call"
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded p-0.5 sm:p-1 transition h-5 w-5 sm:h-6 sm:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      onClick={e => { 
                        e.stopPropagation(); 
                        alert(`Starting video call with ${member.name}...`); 
                      }}
                    >
                      <Icons.video className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
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
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chatMember.img || chatMember.photo} alt={chatMember.name} />
                  <AvatarFallback>{chatMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-base">{chatMember.name}</div>
                  <div className="text-xs text-muted-foreground">{chatMember.role || chatMember.specialization}</div>
                </div>
              </div>
              {chatNotification && (
                <div className="bg-green-500 text-white px-4 py-2 rounded mb-2 text-center animate-in slide-in-from-top">
                  {chatNotification}
                </div>
              )}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {medicationSuggestions
                  .filter(suggestion => suggestion.doctorId._id === chatMember._id)
                  .map((suggestion) => (
                    <div key={suggestion._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <Pill className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-sm mb-2">Medication Suggestion</div>
                            <div className="space-y-1 text-sm">
                              <div><strong>Medication:</strong> {suggestion.medicationName}</div>
                              <div><strong>Dosage:</strong> {suggestion.dosage}</div>
                              <div><strong>Frequency:</strong> {suggestion.frequency}</div>
                              <div><strong>Duration:</strong> {suggestion.duration}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {new Date(suggestion.createdAt).toLocaleDateString()} at {new Date(suggestion.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          {suggestion.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleRejectSuggestion(suggestion._id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptSuggestion(suggestion._id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          {suggestion.status !== 'pending' && (
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={suggestion.status === 'accepted' ? 'default' : 'secondary'}
                                className={suggestion.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {suggestion.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                              </Badge>
                              {suggestion.respondedAt && (
                                <span className="text-xs text-gray-500">
                                  {new Date(suggestion.respondedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
                
                {/* Regular Messages */}
                {chatMember.messages && chatMember.messages.length > 0 && (
                  <div className="space-y-2">
                    {chatMember.messages.map((msg, idx) => (
                      <div key={idx} className="bg-blue-100 text-blue-800 rounded px-3 py-2 text-sm">
                        {msg}
                      </div>
                    ))}
                  </div>
                )}
                
                {medicationSuggestions.filter(s => s.doctorId._id === chatMember._id).length === 0 && 
                 (!chatMember.messages || chatMember.messages.length === 0) && (
                  <div className="text-muted-foreground text-sm text-center py-4">
                    No medication suggestions or messages yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* See All Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>All Care Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ul className="space-y-3">
              {team.map((member: CareTeamMember, index: number) => (
                <li key={member._id || index} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.img || member.photo} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role || member.specialization}</div>
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