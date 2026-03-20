import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, X, ChevronRight, Sparkles, Info, Clock, ExternalLink } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  url: string;
}

const CALENDAR_URL = 'https://calendar.google.com/calendar/embed?src=c_02916cf18d360ab381023fabc7b420ec226d7579ae2a08ce0507e574cc1c1a96%40group.calendar.google.com&ctz=America%2FLos_Angeles';

function formatEventDate(dateStr: string, short = false): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
  const dateStr2 = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' });

  if (short) {
    if (diffDays <= 1) return `Today · ${timeStr} PT`;
    if (diffDays <= 2) return `Tomorrow · ${timeStr} PT`;
    return `${dateStr2} · ${timeStr} PT`;
  }

  const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' });
  return `${fullDate} · ${timeStr} PT`;
}

function formatEndTime(startStr: string, endStr: string): string {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Los_Angeles' });
  const duration = Math.round((end.getTime() - start.getTime()) / 60000);
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
  const durationStr = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;
  return `${startTime} – ${endTime} PT (${durationStr})`;
}

export function EventBanner() {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('event-banner-dismissed')) {
      setDismissed(true);
      setLoaded(true);
      return;
    }
    fetch('/api/events')
      .then(r => r.json())
      .then(data => { if (data.events?.length > 0) setEvent(data.events[0]); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Push nav down by banner height
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('[data-nav="main"]');
    if (!nav) return;
    if (!dismissed && event && bannerRef.current) {
      nav.style.top = `${bannerRef.current.offsetHeight}px`;
    } else {
      nav.style.top = '0px';
    }
    return () => { nav.style.top = '0px'; };
  }, [dismissed, event, loaded]);

  // Close popup on outside click
  useEffect(() => {
    if (!showPopup) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPopup]);

  const handleDismiss = () => {
    sessionStorage.setItem('event-banner-dismissed', '1');
    setDismissed(true);
    const nav = document.querySelector<HTMLElement>('[data-nav="main"]');
    if (nav) nav.style.top = '0px';
  };

  if (!loaded || dismissed || !event) return null;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(event.location)}`;

  return (
    <div ref={bannerRef} className="w-full bg-brand-dark text-white fixed top-0 left-0 right-0 z-[150]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">

        {/* Left badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-brand-dark" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary hidden sm:block">Event</span>
        </div>

        {/* Event details — clickable link */}
        <a
          href={event.url || CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 min-w-0 hover:opacity-90 transition-opacity"
        >
          <span className="text-sm font-extrabold text-white truncate leading-tight">{event.title}</span>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="flex items-center gap-1 text-xs text-white/60 font-medium whitespace-nowrap">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {formatEventDate(event.start, true)}
            </span>
            {event.location && (
              <span className="hidden md:flex items-center gap-1 text-xs text-white/60 font-medium">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{event.location.split(',')[0]}</span>
              </span>
            )}
          </div>
        </a>

        {/* Right: info + RSVP + close */}
        <div className="flex items-center gap-2 flex-shrink-0 relative">

          {/* (i) Info button */}
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setShowPopup(p => !p)}
              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Event details"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Popup */}
            {showPopup && (
              <div className="absolute right-0 top-8 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[300] overflow-hidden">
                {/* Header */}
                <div className="bg-brand-dark px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Upcoming Event</p>
                  <h3 className="text-base font-extrabold text-white leading-tight">{event.title}</h3>
                </div>

                {/* Details */}
                <div className="px-5 py-4 space-y-3">
                  {/* Date & time */}
                  <div className="flex gap-3">
                    <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-brand-dark uppercase tracking-wide">Date & Time</p>
                      <p className="text-sm text-brand-dark/80 font-medium">{formatEventDate(event.start)}</p>
                      <p className="text-xs text-brand-dark/50 font-medium">{formatEndTime(event.start, event.end)}</p>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black text-brand-dark uppercase tracking-wide">Location</p>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-dark/80 font-medium hover:text-primary transition-colors leading-tight block"
                        >
                          {event.location}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-brand-dark uppercase tracking-wide">Duration</p>
                      <p className="text-sm text-brand-dark/80 font-medium">
                        {Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 3600000)} hours
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <div className="pt-1 border-t border-gray-100">
                      <p className="text-xs text-brand-dark/60 font-medium leading-relaxed">{event.description}</p>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-5 pb-4">
                  <a
                    href={event.url || CALENDAR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-brand-dark text-sm font-black py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    RSVP — Add to Calendar
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RSVP button */}
          <a
            href={event.url || CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 bg-primary text-brand-dark text-xs font-black px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            RSVP
            <ChevronRight className="w-3.5 h-3.5" />
          </a>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
