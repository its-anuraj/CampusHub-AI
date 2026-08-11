'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Tag, User, Eye, Plus, Search, Loader2 } from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';
import { DiscussionPost } from '@/types';

export default function StudentDiscussionPage() {
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '', anonymous: false });

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p));
  };

  const handlePost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: DiscussionPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: newPost.anonymous ? 'Anonymous' : 'Arjun Singh',
      isAnonymous: newPost.anonymous,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      likes: 0,
      replies: 0,
      createdAt: new Date(),
    };
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', tags: '', anonymous: false });
    setShowNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Discussion Forum</h1>
          <p className="text-slate-400 text-sm mt-1">Ask questions, share knowledge, connect with peers</p>
        </div>
        <button onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* New Post Form */}
      {showNew && (
        <div className="bg-[#0D1117] border border-blue-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">Create New Post</h3>
          <input
            placeholder="Post title..."
            value={newPost.title}
            onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 transition-all"
          />
          <textarea
            placeholder="Describe your question or topic..."
            value={newPost.content}
            onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
          />
          <input
            placeholder="Tags (comma separated, e.g. DSA, Placements)"
            value={newPost.tags}
            onChange={e => setNewPost(p => ({ ...p, tags: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 transition-all"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-slate-400 text-sm cursor-pointer">
              <input type="checkbox" checked={newPost.anonymous} onChange={e => setNewPost(p => ({ ...p, anonymous: e.target.checked }))} className="accent-blue-500" />
              Post anonymously
            </label>
            <div className="flex gap-2">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handlePost} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-all">Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 max-w-sm">
        <Search className="w-4 h-4 text-slate-500" />
        <input placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none flex-1" />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-[#0D1117] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                {post.isAnonymous ? <User className="w-4 h-4 text-white" /> : <span className="text-white font-semibold text-sm">{post.author.charAt(0)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base group-hover:text-blue-300 transition-colors">{post.title}</h3>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{post.content}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <span className="text-slate-500 text-xs">{post.isAnonymous ? 'Anonymous' : post.author}</span>
                  <span className="text-slate-600 text-xs">{getTimeAgo(post.createdAt)}</span>
                  <div className="flex items-center gap-3 ml-auto">
                    <button onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${post.isLiked ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
                      <ThumbsUp className="w-3.5 h-3.5" />{post.likes}
                    </button>
                    <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />{post.replies}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
