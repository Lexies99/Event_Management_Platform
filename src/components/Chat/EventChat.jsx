import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Pin, 
  Trash2, 
  Lock, 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  Smile, 
  ArrowRight,
  Users
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
  const isOrganizer = activeRole === 'organizer' || activeRole === 'super-admin';

  // Strict Attendance Gating Rule (FR-5.1)
  const isUnlocked = isOrganizer || (currentAttendee && currentAttendee.status === 'attended');

  const eventMessages = chatMessages.filter(m => m.eventId === event?.id);
  const pinnedMessages = eventMessages.filter(m => m.isPinned);
  const regularMessages = eventMessages.filter(m => !m.isPinned);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [eventMessages]);

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
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base leading-tight">
              {event?.title} • Live Delegate Chat
            </h2>
            <p className="text-xs text-slate-400">
              {isOrganizer ? "Organizer Moderation Active" : `Posting as ${currentAttendee?.name || 'Guest'} (${currentAttendee?.category || 'Attendee'})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time WebSocket (FR-5.1)</span>
          </span>
        </div>
      </div>

      {/* LOCKED STATE IF ATTENDEE HAS NOT CHECKED IN (FR-5.1 STRICT RULE) */}
      {!isUnlocked ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto space-y-5 my-8">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
              Gated Feature (FR-5.1)
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Chat Lounge Restricted to Attended Members
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              To keep discussions high quality and spam-free, real-time event chat is strictly limited to registrants who have been scanned in on-site.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-left space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Your Name:</span>
              <span className="text-white font-semibold">{currentAttendee?.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Ticket Code:</span>
              <span className="text-indigo-400 font-mono font-semibold">{currentAttendee?.ticketCode}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-amber-400 font-bold uppercase">{currentAttendee?.status} (Not Checked In)</span>
            </div>
          </div>

          <button
            onClick={handleSimulateCheckIn}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Simulate On-Site Check-In Now & Unlock Chat</span>
          </button>
        </div>
      ) : (
        /* CHAT INTERFACE (WHEN UNLOCKED) */
        <div className="glass-panel rounded-3xl border border-slate-800 flex flex-col h-[580px] overflow-hidden shadow-2xl">
          
          {/* PINNED ANNOUNCEMENTS SECTION (FR-5.2) */}
          {pinnedMessages.length > 0 && (
            <div className="bg-indigo-950/50 border-b border-indigo-900/60 p-3.5 space-y-2 shrink-0">
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 rotate-45" />
                    <div>
                      <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                        Pinned by {msg.authorName}
                      </span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed font-medium">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                  {isOrganizer && (
                    <button
                      onClick={() => onTogglePinMessage(msg.id)}
                      className="text-[10px] text-slate-400 hover:text-white underline shrink-0"
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
              <div className="text-center py-12 text-slate-500 text-xs">
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
                        className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
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
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-slate-800 text-indigo-300 border border-slate-700'
                          }`}>
                            {msg.authorRole}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className={`p-3 rounded-2xl text-xs leading-relaxed inline-block ${
                        isMyMessage
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {/* Organizer Moderation Controls (FR-5.4) */}
                      {isOrganizer && (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400">
                          <button
                            onClick={() => onTogglePinMessage(msg.id)}
                            className="hover:text-amber-300 flex items-center gap-1"
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
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message to attendees... (Enter to send)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30 transition-colors shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
