import React, { useState, useRef, useEffect } from 'react';
import { Send, Pin, Trash2, MessageSquare, Lock, ShieldCheck } from 'lucide-react';

export default function EventChat({
  tenant,
  event,
  registrations = [],
  chatMessages = [],
  onSendMessage,
  onDeleteMessage,
  onTogglePinMessage,
  currentAttendeeId,
  activeRole,
  authUser,
}) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(0);

  const eventRegistrations = registrations.filter((r) => r.eventId === event?.id);
  const currentAttendee = currentAttendeeId
    ? eventRegistrations.find((r) => r.id === currentAttendeeId) || null
    : null;

  const isOrganizer = activeRole === 'organizer' || activeRole === 'super-admin';
  const isStaff = activeRole === 'staff';
  const isUnlocked = isOrganizer || isStaff || currentAttendee?.status === 'attended';

  const myDisplayName = isOrganizer
    ? `${tenant?.organizer?.name || authUser || 'Organizer'} (Organizer)`
    : isStaff
    ? `${authUser || 'Check-In Staff'} (Staff)`
    : currentAttendee?.name || authUser || 'Delegate';

  const myRoleLabel = isOrganizer
    ? 'Organizer'
    : isStaff
    ? 'Check-In Staff'
    : currentAttendee?.category || 'Attendee';

  const myPhoto = isOrganizer
    ? tenant?.logoUrl || ''
    : isStaff
    ? ''
    : currentAttendee?.photoUrl || '';

  const eventChatList = chatMessages.filter((m) => m.eventId === event?.id);
  const pinnedMessages = eventChatList.filter((m) => m.isPinned);
  const regularMessages = eventChatList.filter((m) => !m.isPinned);

  // Only auto-scroll when new messages actually arrive (prevents jumping during 5s sync polling!)
  useEffect(() => {
    if (eventChatList.length > prevCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevCountRef.current = eventChatList.length;
  }, [eventChatList.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage({
        tenantId: tenant.id,
        eventId: event.id,
        authorName: myDisplayName,
        authorRole: myRoleLabel,
        authorPhoto: myPhoto,
        text: inputText.trim(),
        isOrganizer,
      });
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="fp-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold m-0 truncate">{event?.title} · Live Event Chat</h2>
            <p className="text-xs m-0 truncate" style={{ color: 'var(--text-muted)' }}>
              {isOrganizer ? 'Organizer Moderation Active' : `Posting as ${myDisplayName}`}
            </p>
          </div>
        </div>
        <span className="fp-tag-sage text-[11px]">● Synced Across All Devices</span>
      </div>

      {!isUnlocked ? (
        <div className="fp-card p-6 sm:p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--fp-sage)', color: 'var(--fp-olive)' }}>
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold m-0">Chat Unlocks After On-Site Check-In</h3>
          <p className="text-xs sm:text-sm m-0 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            To keep discussions authentic and spam-free, live delegate chat unlocks automatically once Check-In Staff scans your QR ticket at the venue entrance.
          </p>
          {currentAttendee && (
            <div className="p-3.5 rounded-xl border text-xs text-left space-y-1.5" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Attendee:</span><strong>{currentAttendee.name}</strong></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Ticket Code:</span><code className="font-bold">{currentAttendee.ticketCode}</code></div>
              <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Status:</span><span className="capitalize font-bold">{currentAttendee.status}</span></div>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--fp-sage)', color: 'var(--fp-sage-text)' }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified at Entrance Desk</span>
          </div>
        </div>
      ) : (
        <div className="fp-card flex flex-col h-[540px] overflow-hidden">
          {pinnedMessages.length > 0 && (
            <div className="p-3.5 border-b space-y-2 shrink-0 max-h-40 overflow-y-auto" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 min-w-0">
                    <Pin className="w-3.5 h-3.5 shrink-0 mt-0.5 rotate-45" style={{ color: 'var(--fp-olive)' }} />
                    <div className="min-w-0">
                      <span className="font-bold text-[11px] uppercase">{msg.authorName}</span>
                      <p className="m-0 mt-0.5 leading-relaxed break-words">{msg.text}</p>
                    </div>
                  </div>
                  {isOrganizer && (
                    <button
                      type="button"
                      onClick={() => onTogglePinMessage(msg.id)}
                      className="text-[11px] underline shrink-0 bg-transparent border-0 cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                    >
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
                const isMine = msg.authorName === myDisplayName;
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 group ${isMine ? 'flex-row-reverse' : ''}`}>
                    {msg.authorPhoto ? (
                      <img src={msg.authorPhoto} alt={msg.authorName} className="w-8 h-8 rounded-full object-cover border shrink-0" style={{ borderColor: 'var(--border-color)' }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: 'var(--fp-sage)', color: 'var(--fp-sage-text)' }}>
                        {(msg.authorName || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-[80%] space-y-1 ${isMine ? 'text-right' : 'text-left'}`}>
                      <div className={`flex flex-wrap items-center gap-1.5 text-[11px] ${isMine ? 'justify-end' : ''}`}>
                        <span className="font-bold">{msg.authorName}</span>
                        {msg.authorRole && <span className="fp-tag-sage text-[9px] py-0 px-1.5">{msg.authorRole}</span>}
                        <span style={{ color: 'var(--text-muted)' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className="p-3 rounded-xl text-xs sm:text-sm leading-relaxed inline-block border text-left break-words"
                        style={{
                          background: isMine ? 'var(--fp-olive)' : 'var(--bg-card)',
                          color: isMine ? 'var(--fp-olive-text, #ffffff)' : 'var(--text-main)',
                          borderColor: isMine ? 'var(--fp-olive)' : 'var(--border-color)',
                        }}
                      >
                        {msg.text}
                      </div>
                      {isOrganizer && (
                        <div className={`flex items-center gap-2 text-[10px] ${isMine ? 'justify-end' : ''}`} style={{ color: 'var(--text-muted)' }}>
                          <button type="button" onClick={() => onTogglePinMessage(msg.id)} className="inline-flex items-center gap-1 hover:underline bg-transparent border-0 p-0 cursor-pointer" style={{ color: 'inherit' }}>
                            <Pin className="w-3 h-3" /> Pin
                          </button>
                          <button type="button" onClick={() => onDeleteMessage(msg.id)} className="inline-flex items-center gap-1 hover:underline bg-transparent border-0 p-0 cursor-pointer" style={{ color: 'var(--fp-red)' }}>
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
              disabled={isSending}
              className="fp-input flex-1 px-3.5 py-2.5 text-sm"
            />
            <button type="submit" disabled={isSending || !inputText.trim()} className="btn-fp-olive p-2.5 shrink-0 disabled:opacity-50" title="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
