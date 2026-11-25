import React, { useState, useRef, useEffect } from 'react';
import { Send, Pin, Trash2, MessageSquare, Lock, UserCheck } from 'lucide-react';

export default function EventChat({
  tenant,
  event,
  registrations = [],
  chatMessages = [],
  onSendMessage,
  onDeleteMessage,
  onTogglePinMessage,
  currentAttendeeId,
  onCheckInByCode,
  activeRole
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const eventRegistrations = registrations.filter((r) => r.eventId === event?.id);
  const currentAttendee = eventRegistrations.find((r) => r.id === currentAttendeeId) || eventRegistrations[0];
  const isOrganizer = activeRole === 'organizer' || activeRole === 'super-admin';

  const isUnlocked = isOrganizer || currentAttendee?.status === 'attended';
  const eventChatList = chatMessages.filter((m) => m.eventId === event?.id);
  const pinnedMessages = eventChatList.filter((m) => m.isPinned);
  const regularMessages = eventChatList.filter((m) => !m.isPinned);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage({
      tenantId: tenant.id,
      eventId: event.id,
      authorName: isOrganizer ? `${tenant?.organizer?.name || 'Organizer'} (Organizer)` : currentAttendee.name,
      authorRole: isOrganizer ? 'Organizer' : currentAttendee.category,
      authorPhoto: isOrganizer ? tenant?.logoUrl : currentAttendee.photoUrl,
      text: inputText.trim(),
      isOrganizer
    });
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="fp-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold m-0 truncate">{event?.title} · Delegate Chat</h2>
            <p className="text-xs m-0 truncate" style={{ color: 'var(--text-muted)' }}>
              {isOrganizer ? 'Organizer Moderation Active' : `Posting as ${currentAttendee?.name || 'Delegate'}`}
            </p>
          </div>
        </div>
        <span className="fp-tag-sage text-[11px]">● Live Event Room</span>
      </div>

      {!isUnlocked ? (
        <div className="fp-card p-6 sm:p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold m-0">Chat Unlocks Upon On-Site Check-In</h3>
          <p className="text-xs sm:text-sm m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            To keep event discussions authentic and spam-free, community chat is restricted to checked-in attendees.
          </p>
          {currentAttendee && (
            <div className="p-3.5 rounded-xl border text-xs text-left space-y-1.5" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Attendee:</span><strong>{currentAttendee.name}</strong></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Ticket:</span><code className="font-bold">{currentAttendee.ticketCode}</code></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Status:</span><span className="capitalize font-bold">{currentAttendee.status}</span></div>
            </div>
          )}
          {currentAttendee && (
            <button
              type="button"
              onClick={() => onCheckInByCode(currentAttendee.ticketCode, 'Self-Service Check-In', false, 'day-1', 'Day 1', { eventId: event?.id, tenantId: tenant?.id })}
              className="btn-fp-olive w-full py-2.5 text-xs sm:text-sm inline-flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Simulate Check-In &amp; Unlock Chat</span>
            </button>
          )}
        </div>
      ) : (
        <div className="fp-card flex flex-col h-[540px] overflow-hidden">
          {pinnedMessages.length > 0 && (
            <div className="p-3.5 border-b space-y-2 shrink-0" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 min-w-0">
                    <Pin className="w-3.5 h-3.5 shrink-0 mt-0.5 rotate-45" style={{ color: 'var(--fp-olive)' }} />
                    <div>
                      <span className="font-bold text-[11px] uppercase">{msg.authorName}</span>
                      <p className="m-0 mt-0.5 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                  {isOrganizer && (
                    <button type="button" onClick={() => onTogglePinMessage(msg.id)} className="text-[11px] underline shrink-0" style={{ color: 'var(--text-muted)' }}>
                      Unpin
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" style={{ background: 'var(--bg-main)' }}>
            {regularMessages.length === 0 ? (
              <div className="text-center py-12 text-xs" style={{ color: 'var(--text-muted)' }}>
                No messages yet. Start the event conversation!
              </div>
            ) : (
              regularMessages.map((msg) => {
                const isMine = msg.authorName === currentAttendee?.name;
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 group ${isMine ? 'flex-row-reverse' : ''}`}>
                    {msg.authorPhoto ? (
                      <img src={msg.authorPhoto} alt={msg.authorName} className="w-8 h-8 rounded-full object-cover border shrink-0" style={{ borderColor: 'var(--border-color)' }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: 'var(--fp-sage)', color: 'var(--fp-sage-text)' }}>
                        {msg.authorName.charAt(0)}
                      </div>
                    )}
                    <div className={`max-w-[80%] space-y-1 ${isMine ? 'text-right' : 'text-left'}`}>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="font-bold">{msg.authorName}</span>
                        {msg.authorRole && <span className="fp-tag-sage text-[9px] py-0 px-1.5">{msg.authorRole}</span>}
                        <span style={{ color: 'var(--text-muted)' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed inline-block border"
                        style={{
                          background: isMine ? 'var(--fp-olive)' : 'var(--bg-card)',
                          color: isMine ? 'var(--fp-olive-text, #ffffff)' : 'var(--text-main)',
                          borderColor: isMine ? 'var(--fp-olive)' : 'var(--border-color)',
                        }}
                      >
                        {msg.text}
                      </div>
                      {isOrganizer && (
                        <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <button type="button" onClick={() => onTogglePinMessage(msg.id)} className="inline-flex items-center gap-1 hover:underline">
                            <Pin className="w-3 h-3" /> Pin
                          </button>
                          <button type="button" onClick={() => onDeleteMessage(msg.id)} className="inline-flex items-center gap-1 hover:underline" style={{ color: 'var(--fp-red)' }}>
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

          <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <input
              type="text"
              placeholder="Write a message to event attendees..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="fp-input flex-1 px-3.5 py-2.5 text-sm"
            />
            <button type="submit" className="btn-fp-olive p-2.5 shrink-0" title="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
