// Reusable status badge — used on Dashboard and Projects pages
const STATUS_STYLES = {
    Planning: "bg-gray-100 text-gray-700",
    Active: "bg-black text-white",
    Completed: "bg-green-50 text-green-700 border border-green-200",
};

export function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
            {status}
        </span>
    );
}

// Inline error banner — used on every page with form submission
export function ErrorBanner({ message }) {
    if (!message) return null;
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {message}
        </div>
    );
}
