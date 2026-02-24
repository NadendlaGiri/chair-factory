export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
    const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    const spinner = (
        <div className={`${sizes[size]} border-3 border-t-transparent rounded-full animate-spin`}
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    );
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50"
                style={{ backgroundColor: 'var(--surface)' }}>
                <div className="flex flex-col items-center gap-4">
                    {spinner}
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</span>
                </div>
            </div>
        );
    }
    return <div className="flex justify-center py-12">{spinner}</div>;
}
