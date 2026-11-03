import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Pin, 
  Trash2, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function EventChat({
  tenant,
  event,
  registrations,
  chatMessages,
  onSendMessage,
  onDeleteMessage,
  onTogglePinMessage,
  currentAttendeeId,
  onCheckInByCode,
  activeRole
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const eventRegistrations = registrations.filter(r => r.eventId === event?.id);
  const currentAttendee = eventRegistrations.find(r => r.id === currentAttendeeId) || eventRegistrations[0];
  const isOrganizer = activeRole === 'organizer';

  // FR-5.1: Attendee must be "attended" (checked in) OR be an organizer to participate
  const isUnlocked = isOrganizer || currentAttendee?.status === 'attended';

  // Event specific chat stream
  const eventChatList = chatMessages.filter(m => m.eventId === event?.id);
  const pinnedMessages = eventChatList.filter(m => m.isPinned);
  const regularMessages = eventChatList.filter(m => !m.isPinned);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      tenantId: tenant.id,
      eventId: event.id,
      authorName: isOrganizer ? `${tenant?.organizer?.name || 'Sarah Jenkins'} (Organizer)` : currentAttendee.name,
      authorRole: isOrganizer ? 'Organizer' : currentAttendee.category,
      authorPhoto: isOrganizer ? tenant?.logoUrl : currentAttendee.photoUrl,
      text: inputText,
      isOrganizer
    });

    setInputText('');
  };

  const handleSimulateCheckIn = () => {
    if (currentAttendee) {
      onCheckInByCode(currentAttendee.ticketCode, "Self-Service Station");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-[#1c1c1b] border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#AB6088]/20 text-[#FB9378] border border-[#AB6088]/30 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-white text-base leading-tight">
              {event?.title} • Live Delegate Chat
            </h2>
            <p className="text-xs text-white/50">
              {isOrganizer ? "Organizer Moderation Active" : `Posting as ${currentAttendee?.name || 'Guest'} (${currentAttendee?.category || 'Attendee'})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E0C97E]/15 text-[#FCF8B3] border border-[#E0C97E]/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time WebSocket (FR-5.1)</span>
          </span>
        </div>
      </div>

      {/* LOCKED STATE IF ATTENDEE HAS NOT CHECKED IN (FR-5.1 STRICT RULE) */}
      {!isUnlocked ? (
        <div className="bg-[#1c1c1b] p-8 sm:p-12 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-5 my-8 shadow-2xl">
          <div className="w-16 h-16 bg-[#E0C97E]/15 border border-[#E0C97E]/30 text-[#E0C97E] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-extrabold text-[#FCF8B3] uppercase tracking-wider px-2.5 py-0.5 bg-[#E0C97E]/15 rounded-full border border-[#E0C97E]/30">
              Gated Feature (FR-5.1)
            </span>
            <h3 className="font-heading font-extrabold text-xl text-white mt-2">
              Chat Lounge Restricted to Attended Members
            </h3>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              To keep discussions high quality and spam-free, real-time event chat is strictly limited to registrants who have been scanned in on-site.
            </p>
          </div>

          <div className="bg-[#141413] rounded-2xl p-4 border border-white/10 text-xs text-left space-y-2">
            <div className="flex justify-between text-white/50">
              <span>Your Name:</span>
              <span className="text-white font-semibold">{currentAttendee?.name}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Ticket Code:</span>
              <span className="text-[#FCF8B3] font-mono font-semibold">{currentAttendee?.ticketCode}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Current Status:</span>
              <span className="text-[#FB9378] font-bold uppercase">{currentAttendee?.status} (Not Checked In)</span>
            </div>
          </div>

          <button
            onClick={handleSimulateCheckIn}
            className="w-full py-3 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-extrabold rounded-2xl text-xs shadow-xl shadow-[#FB9378]/25 flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-black" />
            <span>Simulate On-Site Check-In Now & Unlock Chat</span>
          </button>
        </div>
      ) : (
        /* CHAT INTERFACE (WHEN UNLOCKED) */
        <div className="bg-[#1c1c1b] rounded-3xl border border-white/10 flex flex-col h-[580px] overflow-hidden shadow-2xl">
          
          {/* PINNED ANNOUNCEMENTS SECTION (FR-5.2) */}
          {pinnedMessages.length > 0 && (
            <div className="bg-[#141413] border-b border-white/10 p-3.5 space-y-2 shrink-0">
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Pin className="w-3.5 h-3.5 text-[#E0C97E] shrink-0 mt-0.5 rotate-45" />
                    <div>
                      <span className="font-bold text-[#FCF8B3] text-[11px] uppercase tracking-wider font-mono">
                        Pinned by {msg.authorName}
                      </span>
                      <p className="text-white/90 mt-0.5 leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                  {isOrganizer && (
                    <button
                      onClick={() => onTogglePinMessage(msg.id)}
                      className="text-[10px] text-white/40 hover:text-white underline shrink-0"
                    >
                      Unpin
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CHAT MESSAGES STREAM */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {regularMessages.length === 0 ? (
              <div className="text-center py-12 text-white/40 text-xs">
                No chat messages yet. Start the conversation!
              </div>
            ) : (
              regularMessages.map((msg) => {
                const isMyMessage = msg.authorName === currentAttendee?.name;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 group ${isMyMessage ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Author Avatar */}
                    {msg.authorPhoto ? (
                      <img
                        src={msg.authorPhoto}
                        alt={msg.authorName}
                        className="w-8 h-8 rounded-xl object-cover border border-white/15 shrink-0 mt-0.5 bg-[#141413]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black flex items-center justify-center font-bold text-xs shrink-0">
                        {msg.authorName.charAt(0)}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[75%] space-y-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-bold text-white">{msg.authorName}</span>
                        {msg.authorRole && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            msg.isOrganizer 
                              ? 'bg-[#E0C97E]/20 text-[#FCF8B3] border border-[#E0C97E]/30' 
                              : 'bg-white/10 text-white/80 border border-white/15'
                          }`}>
                            {msg.authorRole}
                          </span>
                        )}
                        <span className="text-[10px] text-white/40">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className={`p-3 rounded-2xl text-xs leading-relaxed inline-block ${
                        isMyMessage
                          ? 'bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black font-medium rounded-tr-none shadow-md'
                          : 'bg-[#141413] text-white/90 border border-white/10 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Organizer Moderation Controls (FR-5.4) */}
                      {isOrganizer && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40">
                          <button
                            onClick={() => onTogglePinMessage(msg.id)}
                            className="hover:text-[#FCF8B3] flex items-center gap-1"
                          >
                            <Pin className="w-3 h-3" /> Pin
                          </button>
                          <button
                            onClick={() => onDeleteMessage(msg.id)}
                            className="hover:text-rose-400 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#141413] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message to attendees... (Enter to send)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#1c1c1b] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FB9378]"
            />
            <button
              type="submit"
              className="p-2.5 bg-gradient-to-r from-[#AB6088] via-[#FB9378] to-[#E0C97E] text-black rounded-2xl shadow-lg shadow-[#FB9378]/20 transition-all hover:opacity-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
