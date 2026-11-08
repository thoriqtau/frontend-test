import { useEffect, useRef } from "react";

import UserDetailCard from "./user-detail-card.jsx";

export default function UserDetailModal({ user, onClose }) {
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!user) return undefined;

        previousFocusRef.current = document.activeElement;
        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            previousFocusRef.current?.focus?.();
        };
    }, [onClose, user]);

    if (!user) return null;

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
            onMouseDown={ (event) => {
                if (event.target === event.currentTarget) onClose();
            } }
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-detail-title"
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto overscroll-contain bg-(--ink-2) [scrollbar-width:thin] [scrollbar-color:var(--line-strong)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-(--line-strong) [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:transition-none [&::-webkit-scrollbar-corner]:bg-transparent"
            >
                <div className="sticky top-0 z-10 flex justify-end bg-(--ink-2) p-3">
                    <button
                        ref={ closeButtonRef }
                        type="button"
                        onClick={ onClose }
                        aria-label="Close user details"
                        className="grid size-8 place-items-center rounded-sm bg-(--ink-4) text-lg leading-none text-(--bone-dim) hover:bg-(--line-strong) hover:text-(--bone) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--electric)"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="px-4 pb-4 sm:px-6">
                    <h2 id="user-detail-title" className="sr-only">
                        Details for { user.name || "user" }
                    </h2>
                    <UserDetailCard user={ user } />
                </div>
            </div>
        </div>
    );
}
