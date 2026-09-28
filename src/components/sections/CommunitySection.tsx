import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Database, 
  Plus, 
  Search,
  Sparkles
} from 'lucide-react';
import { CommunityPost } from '../../types/marine';

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Chief Oceanographer',
      institution: 'National Institute of Oceanography (NIO)',
      avatar: 'AT',
      verified: true
    },
    title: 'Anomalous Upwelling Event & Chlorophyll Surge Observed off Northern Coromandel',
    body: 'Sentinel-3 SLSTR pass from 06:00 UTC captures an intense 1.8°C SST depression coincident with strong offshore Ekman transport. Acoustic backscatter on our deployed moorings shows dense biomass migration into the photic zone. Recommending coastal fishery advisories.',
    tags: ['Sentinel-3', 'Upwelling', 'SST', 'Pelagic Ecology'],
    likes: 84,
    commentsCount: 16,
    timestamp: '3 hours ago',
    locationTag: '13.4°N, 80.8°E',
    verifiedDataset: 'Copernicus CMEMS Level-4 SST (0.05°)'
  },
  {
    id: 'post-2',
    author: {
      name: 'Maya Lin',
      role: 'GIS & Satellite Analyst',
      institution: 'Marine Megafauna Sanctuary Watch',
      avatar: 'ML',
      verified: true
    },
    title: 'Dark Fleet AIS Gap Detection Near Olive Ridley Sanctuary Boundaries',
    body: 'ORCA Anomaly Agent flagged 4 non-broadcasting AIS vessels maneuvering within 8 nautical miles of Gahirmatha Marine Sanctuary. Radar satellite cross-referencing confirms active bottom-trawling gear signatures. Alert dispatched to maritime patrol dispatch.',
    tags: ['AIS Anomaly', 'Gahirmatha', 'Dark Fleet', 'MPA Protection'],
    likes: 129,
    commentsCount: 32,
    timestamp: '6 hours ago',
    locationTag: '20.6°N, 87.1°E',
    verifiedDataset: 'Spire Global AIS + Sentinel-1 SAR'
  },
  {
    id: 'post-3',
    author: {
      name: 'Captain Sean O’Connor',
      role: 'Master Mariner & Weather Router',
      institution: 'Global Fleet Safety Taskforce',
      avatar: 'SO',
      verified: true
    },
    title: 'Validation of ORCA Isochrone Weather Route in 4.5m Sea State',
    body: 'Just completed Singapore to Colombo transit aboard MV Ever Glory using ORCA alternative rhumb-line vector. Swell encounter angle was maintained at optimal 35° quartering stern, reducing roll acceleration by 60% and achieving 8.8% fuel savings over standard great circle.',
    tags: ['Weather Routing', 'Fuel Efficiency', 'SOLAS', 'Container Fleet'],
    likes: 95,
    commentsCount: 19,
    timestamp: '1 day ago',
    locationTag: 'Equatorial Indian Ocean',
    verifiedDataset: 'ECMWF Wave Model + Onboard Telemetry'
  }
];

export const CommunitySection: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const tags = ['all', 'Sentinel-3', 'AIS Anomaly', 'Weather Routing', 'MPA Protection', 'Upwelling'];

  const handleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            likes: likedPosts[id] ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const filteredPosts = selectedTag === 'all'
    ? posts
    : posts.filter(p => p.tags.includes(selectedTag));

  return (
    <section id="community" className="w-full bg-[#020814] py-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-purple-400 uppercase mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Global Marine Intelligence Network</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Ocean Research Community
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Connect with leading maritime researchers, master mariners, and Earth observation scientists sharing auditable oceanographic findings.
            </p>
          </div>

          <button className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all">
            <Plus className="w-4 h-4" />
            <span>Publish Observation</span>
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors capitalize ${
                selectedTag === t
                  ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="p-5 rounded-3xl bg-[#040e22] border border-cyan-500/15 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Author Card */}
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {post.author.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{post.author.name}</span>
                      {post.author.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{post.author.institution}</span>
                  </div>
                </div>

                {/* Title & Body */}
                <h3 className="text-sm font-bold text-slate-100 mb-2 leading-snug hover:text-cyan-300 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
                  {post.body}
                </p>

                {/* Location & Dataset Badge */}
                <div className="space-y-1.5 mb-4">
                  {post.locationTag && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{post.locationTag}</span>
                    </div>
                  )}
                  {post.verifiedDataset && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <Database className="w-3 h-3 text-emerald-400" />
                      <span>Dataset: {post.verifiedDataset}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-cyan-500/10 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono text-slate-500">{post.timestamp}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 transition-colors ${
                      likedPosts[post.id] ? 'text-rose-400' : 'hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-current' : ''}`} />
                    <span className="font-mono text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs">{post.commentsCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
