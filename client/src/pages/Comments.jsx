import { useEffect, useRef, useState } from "react";
import Layout from "../component/layout/Layout";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import { ErrorBanner } from "../component/shared";
import { formatDateTime } from "../utils/formatDate";
import { Trash2 } from "lucide-react";

function Comments() {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [message, setMessage] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const bottomRef = useRef(null);

    // Fetch all visible projects for the dropdown on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/projects");
                setProjects(res.data.projects);
            } catch (err) {
                setError("Failed to load projects.");
                console.error(err);
            }
        };
        fetchProjects();
    }, []);

    // Fetch comments whenever the selected project changes
    useEffect(() => {
        if (!selectedProject) return;
        const fetchComments = async () => {
            setCommentsLoading(true);
            try {
                const res = await api.get(`/comments/${selectedProject}`);
                setComments(res.data.comments);
            } catch (err) {
                setError("Failed to load comments.");
                console.error(err);
            } finally {
                setCommentsLoading(false);
            }
        };
        fetchComments();
    }, [selectedProject]);

    // Scroll to bottom whenever comments update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject || !message.trim()) return;

        setSubmitting(true);
        setError("");
        try {
            await api.post("/comments", {
                project_id: selectedProject,
                message: message.trim(),
            });
            setMessage("");
            const res = await api.get(`/comments/${selectedProject}`);
            setComments(res.data.comments);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to post message.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }
        try {
            await api.delete(`/comments/${id}`);
            const res = await api.get(`/comments/${selectedProject}`);
            setComments(res.data.comments);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete comment.");
        }
    };

    // A message is "mine" if user_id matches
    const isMine = (comment) => comment.user_id === user?.id;

    // Check if current user is authorized to delete the comment
    const canDelete = (comment) => user?.role === "admin" || comment.user_id === user?.id;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Page header */}
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Comments</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {user?.role === "admin"
                            ? "View and respond to client feedback on your projects."
                            : "Leave feedback and get updates from your agency team."}
                    </p>
                </div>

                <ErrorBanner message={error} />

                {/* Project selector */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Project
                    </label>
                    <select
                        value={selectedProject}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedProject(val);
                            if (!val) {
                                setComments([]);
                            }
                        }}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white"
                    >
                        <option value="">Choose a project to view its thread...</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chat thread */}
                {selectedProject && (
                    <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden" style={{ minHeight: "420px" }}>

                        {/* Thread header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    {projects.find((p) => String(p.id) === String(selectedProject))?.title || "Discussion"}
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {comments.length} {comments.length === 1 ? "message" : "messages"}
                                </p>
                            </div>
                        </div>

                        {/* Message list */}
                        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: "380px" }}>

                            {commentsLoading && (
                                <div className="flex items-center justify-center h-32">
                                    <p className="text-sm text-gray-400">Loading messages...</p>
                                </div>
                            )}

                            {!commentsLoading && comments.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-32">
                                    <p className="text-sm text-gray-400">No messages yet.</p>
                                    <p className="text-xs text-gray-300 mt-1">
                                        {user?.role === "admin"
                                            ? "Start the conversation with your client."
                                            : "Send your first message to the team."}
                                    </p>
                                </div>
                            )}

                            {!commentsLoading && comments.map((comment) => {
                                const mine = isMine(comment);
                                const allowedDelete = canDelete(comment);
                                return (
                                    <div
                                        key={comment.id}
                                        className={`flex gap-3 ${mine ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-1
                                                ${mine
                                                    ? "bg-gray-900 text-white"
                                                    : comment.user_role === "admin"
                                                        ? "bg-gray-200 text-gray-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {comment.name?.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Bubble Container */}
                                        <div className={`max-w-xs lg:max-w-md ${mine ? "items-end" : "items-start"} flex flex-col`}>
                                            {/* Sender + role tag */}
                                            <div className={`flex items-center gap-1.5 mb-1 ${mine ? "flex-row-reverse" : "flex-row"}`}>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {mine ? "You" : comment.name}
                                                </span>
                                                {comment.user_role === "admin" && (
                                                    <span className="text-xs bg-gray-900 text-white px-1.5 py-0.5 rounded-full leading-none">
                                                        Agency
                                                    </span>
                                                )}
                                            </div>

                                            {/* Message bubble */}
                                            <div className="group relative flex items-center gap-2">
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                                                        ${mine
                                                            ? "bg-gray-900 text-white rounded-tr-sm"
                                                            : "bg-gray-100 text-gray-800 rounded-tl-sm"
                                                        }`}
                                                >
                                                    {comment.message}
                                                </div>

                                                {/* Delete comment icon button shown on hover/group */}
                                                {allowedDelete && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className={`text-gray-400 hover:text-red-600 transition flex-shrink-0 p-1 rounded-full hover:bg-gray-50
                                                            ${mine ? "order-first" : "order-last"}`}
                                                        title="Delete Comment"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <span className="text-xs text-gray-400 mt-1">
                                                {formatDateTime(comment.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            <div ref={bottomRef} />
                        </div>

                        {/* Reply box */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                                <textarea
                                    rows="2"
                                    placeholder="Write a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit(e);
                                    }}
                                    className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !message.trim()}
                                    className="bg-black text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    {submitting ? "..." : "Send"}
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 mt-1.5">
                                Press <kbd className="bg-gray-100 px-1 py-0.5 rounded text-xs">Ctrl+Enter</kbd> to send
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </Layout>
    );
}

export default Comments;
