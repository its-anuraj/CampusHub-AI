'use client';

import { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  User,
  Plus,
  Search,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { useToast } from '@/lib/toastContext';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  isAnonymous: boolean;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  replies: number;
  createdAt: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    title: 'How to prepare for Dynamic Programming in Technical Rounds?',
    content:
      'Any recommended problem sets or patterns for mastering 2D DP and Bitmask DP before upcoming campus placement season? Currently doing LeetCode Mediums.',
    author: 'Anuraj Singh',
    category: 'Career & Placements',
    isAnonymous: false,
    tags: ['DSA', 'Placements', 'Algorithms'],
    likes: 24,
    isLiked: false,
    replies: 8,
    createdAt: '3 hours ago',
  },
  {
    id: 'p-2',
    title: 'Operating Systems: Banker’s Algorithm Safety State doubts',
    content:
      'Can someone explain safety state vs safe sequence with a quick numerical example from today’s lecture by Dr. Anita?',
    author: 'Sneha Roy',
    category: 'Academics',
    isAnonymous: false,
    tags: ['Operating Systems', 'Academics', 'CS503'],
    likes: 15,
    isLiked: false,
    replies: 4,
    createdAt: '6 hours ago',
  },
  {
    id: 'p-3',
    title: 'Annual TechFest Hackathon 2026 Registration Open!',
    content:
      '48-hour AI & Web3 Hackathon happening next weekend in Computing Lab. Prizes worth ₹1,50,000. Looking for 1 frontend dev with Next.js/Tailwind experience to team up!',
    author: 'ACM Student Chapter',
    category: 'Campus Events',
    isAnonymous: false,
    tags: ['Hackathon', 'TechFest', 'WebDev'],
    likes: 56,
    isLiked: true,
    replies: 19,
    createdAt: '1 day ago',
  },
  {
    id: 'p-4',
    title: 'Tips for balancing semester coursework and GATE CS preparation?',
    content:
      'Starting GATE prep from 5th semester. Which subjects should be prioritized first alongside college syllabus?',
    author: 'Anonymous Student',
    category: 'Academics',
    isAnonymous: true,
    tags: ['GATE', 'Preparation', 'StudyTips'],
    likes: 31,
    isLiked: false,
    replies: 12,
    createdAt: '2 days ago',
  },
];

const CATEGORIES = ['ALL', 'Academics', 'Career & Placements', 'Campus Events', 'Hostel & Mess', 'Tech & Coding'];

export default function StudentDiscussionPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Academics');
  const [newTags, setNewTags] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          const countChange = nextLiked ? 1 : -1;
          if (nextLiked) toast.success('Post upvoted!', 'Upvoted');
          return { ...p, isLiked: nextLiked, likes: p.likes + countChange };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.warning('Please enter both title and content.');
      return;
    }

    const created: Post = {
      id: `p-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: isAnonymous ? 'Anonymous Student' : 'Anuraj Singh',
      category: newCategory,
      isAnonymous,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 1,
      isLiked: true,
      replies: 0,
      createdAt: 'Just now',
    };

    setPosts([created, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsAnonymous(false);
    setShowNewModal(false);
    toast.success('Your discussion topic has been published to the campus community!', 'Published');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Discussion Forum</h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingUp className="w-3 h-3 text-blue-600" /> Active Community
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connect with peers, collaborate on academic projects, ask anonymous doubts, and share campus insights
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Start Discussion
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:max-w-md shadow-2xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            placeholder="Search discussion topics, tags, questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Discussions Post List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No discussions found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or category filter</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-slate-400">• {post.createdAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer action bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    {post.isAnonymous ? '?' : post.author.charAt(0)}
                  </div>
                  <span className="text-[11px] font-medium">{post.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      post.isLiked
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toast.info('Discussion thread replies expanded.', 'Forum Thread')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.replies} Replies</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create New Campus Discussion</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Discussion Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best resources for learning Graph algorithms?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="DSA, Python, Labs"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Content</label>
                <textarea
                  rows={4}
                  placeholder="Share details, context, code snippet, or questions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none resize-none"
                  required
                />
              </div>

              {/* Anonymous checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="anon" className="text-xs text-slate-600 cursor-pointer">
                  Post anonymously (protects your name and profile)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
