'use client'
import React, { useEffect, useState, FormEvent } from "react";
import { Calendar, Clock, MapPin, User, Star, ArrowRight, Sparkles, Play, Search, XCircle } from "lucide-react";

// Event Type
interface Event {
  "Event Name": string;
  Location: string;
  Address: string;
  "Organizer Name": string;
  "Event Date": string;
  "Event Time": string;
  "Event Type": string;
  isPastEvent?: boolean;
}

// Search Bar
interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
  onTagClick?: (tag: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSearch, onTagClick }) => {
  const [focusedInput, setFocusedInput] = useState(false);
  const tags = ['Workshops', 'Tech Events', 'Music', 'Art & Culture', 'Sports', 'Networking'];

  const handleSearch = () => { if (onSearch) onSearch(); };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className={`relative ${focusedInput ? 'scale-105' : 'scale-100'} transition-transform duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-slate-800 rounded-2xl blur-sm opacity-20 transition-opacity duration-300" />
        <div className="relative bg-white rounded-2xl border-2 border-gray-100 shadow-xl">
          <div className="flex items-center px-4 py-3">
            <Search className={`w-5 h-5 mr-3 ${focusedInput ? 'text-red-700' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search events by city, name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-base text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none font-medium"
            />
            <button
              onClick={handleSearch}
              className="ml-3 bg-gradient-to-r from-red-800 to-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 shadow-lg transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagClick && onTagClick(tag.toLowerCase())}
            className="px-4 py-1.5 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-200 text-xs font-medium shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

// Carousel Component
interface CarouselProps { onJoinEvent: () => void; }
const Carousel: React.FC<CarouselProps> = ({ onJoinEvent }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const sampleEvents: Event[] = [
      { "Event Name": "Advanced React Workshop", Location: "Mumbai", Address: "Tech Hub, Bandra Kurla Complex", "Organizer Name": "React India", "Event Date": "2025-08-15", "Event Time": "10:00 AM", "Event Type": "Workshop" },
      { "Event Name": "AI/ML Conference 2025", Location: "Bangalore", Address: "Convention Center, Electronic City", "Organizer Name": "Tech Innovators", "Event Date": "2025-08-20", "Event Time": "09:00 AM", "Event Type": "Conference" },
      { "Event Name": "Startup Networking Meetup", Location: "Delhi", Address: "Innovation Hub, Connaught Place", "Organizer Name": "Startup Delhi", "Event Date": "2025-08-25", "Event Time": "06:00 PM", "Event Type": "Meetup" }
    ];
    setEvents(sampleEvents);
  }, []);

  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % events.length), 4000);
    return () => clearInterval(interval);
  }, [events]);

  if (!events.length) return <p>Loading...</p>;

  const event = events[current];
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-500 px-4 py-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 text-center">Live Events</h1>
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-extrabold mb-3 text-center text-gray-800">{event["Event Name"]}</h2>
        <p className="text-blue-600 text-center text-lg font-medium mb-2">{event["Event Type"]} &bull; {event.Location}</p>
        <p className="text-gray-700 text-center mb-1">{event["Event Date"]} at {event["Event Time"]}</p>
        <p className="text-gray-600 text-center mb-2">Organizer: {event["Organizer Name"]}</p>
        <p className="text-gray-500 text-center">{event.Address}</p>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {events.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-white border border-blue-500" : "bg-gray-300"}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

// EventGrid Component
interface EventGridProps { events?: Event[]; onRegisterNow: () => void; }
const EventGrid: React.FC<EventGridProps> = ({ events, onRegisterNow }) => {
  if (!events || events.length === 0) return <p>No events found.</p>;

  const upcomingEvents = events.filter(e => !e.isPastEvent);
  const pastEvents = events.filter(e => e.isPastEvent);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Upcoming Tech Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">{event["Event Type"]}</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">{event.Location}</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{event["Event Name"]}</h2>
            <p><strong>Organizer:</strong> {event["Organizer Name"]}</p>
            <p>{event["Event Date"]} at {event["Event Time"]}</p>
            <p>{event.Address}</p>
            <button onClick={onRegisterNow} className="mt-4 w-full bg-red-700 text-white py-2 rounded-lg">Register Now</button>
          </div>
        ))}
      </div>

      {pastEvents.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-center mt-12 mb-6">Past Events</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl shadow-md overflow-hidden p-6 opacity-75">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">{event["Event Type"]}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">{event.Location}</span>
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800">Past Event</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{event["Event Name"]}</h2>
                <p><strong>Organizer:</strong> {event["Organizer Name"]}</p>
                <p>{event["Event Date"]} at {event["Event Time"]}</p>
                <p>{event.Address}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Registration Modal
interface RegistrationFormModalProps { isOpen: boolean; onClose: () => void; }
const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return setError('Please fill in all fields.');
    setIsSubmitted(true);
    setTimeout(() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '' }); onClose(); }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-slate-900 text-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-red-900">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><XCircle size={32} /></button>
        {isSubmitted ? (
          <div className="text-center py-10">
            <Sparkles size={64} className="text-red-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold text-red-200 mb-2">Registration Successful!</h3>
            <p className="text-gray-300">You have been registered for the event. See you there!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-gray-700" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-gray-700" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-gray-700" required />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-red-700 text-white py-3 rounded-xl font-bold">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export { SearchBar, Carousel, EventGrid, RegistrationFormModal };

