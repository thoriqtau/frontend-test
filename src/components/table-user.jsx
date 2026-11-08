import { useEffect, useState } from "react";

import { userFetch } from "../api/user.js";
import UserDetailModal from "./user-detail-modal.jsx";

function getInitials (name) {
    const parts = String(name ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "?";

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function StateRow ({ children, cellClassName, role }) {
    return (
        <tr>
            <td className={ cellClassName }>
                <div role={ role } className="text-center">
                    { children }
                </div>
            </td>
        </tr>
    );
}

export default function UserTable ({ searchQuery = "" }) {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("loading");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadUsers () {
            setStatus("loading");

            try {
                const payload = await userFetch({ signal: controller.signal });

                if (!Array.isArray(payload)) {
                    throw new Error("Unexpected user response.");
                }

                if (controller.signal.aborted) return;

                setUsers(
                    payload.filter(
                        (user) => user && typeof user === "object",
                    ),
                );
                setStatus("success");
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") {
                    return;
                }

                setUsers([]);
                setStatus("error");
            }
        }

        loadUsers();

        return () => controller.abort();
    }, []);

    const normalizedSearchQuery = String(searchQuery).trim().toLowerCase();
    const filteredUsers = normalizedSearchQuery
        ? users.filter((user) => {
            const name = String(user.name ?? "").toLowerCase();
            const email = String(user.email ?? "").toLowerCase();

            return (
                name.includes(normalizedSearchQuery) ||
                email.includes(normalizedSearchQuery)
            );
        })
        : users;

    const isLoading = status === "loading";
    const isError = status === "error";
    const isEmpty = status === "success" && users.length === 0;
    const isNoMatch =
        status === "success" &&
        users.length > 0 &&
        normalizedSearchQuery.length > 0 &&
        filteredUsers.length === 0;
    const closeModal = () => setSelectedUser(null);

    return (
        <>
            <div className="mt-6 border border-(--line-strong) bg-(--ink-2)">
                <div role="region" aria-label="User list table" className="overflow-x-auto">
                    <table
                        aria-busy={ isLoading }
                        className="w-full min-w-0 border-collapse text-left"
                    >
                        <caption className="sr-only">
                            Users from the API. Select a user to view more details.
                        </caption>

                        <thead>
                            <tr className="border-b border-(--line-strong) bg-(--ink-3)">
                                <th
                                    scope="col"
                                    className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-(--bone-dim) sm:px-6"
                                >
                                    User
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            { isLoading && (
                                <StateRow
                                    cellClassName="px-4 py-12 sm:px-6 sm:py-16"
                                >
                                    <p
                                        role="status"
                                        aria-live="polite"
                                        className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-(--bone-dim)"
                                    >
                                        Loading...
                                    </p>
                                </StateRow>
                            ) }

                            { isError && (
                                <StateRow
                                    cellClassName="px-4 py-12 sm:px-6 sm:py-16"
                                    role="alert"
                                >
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-(--bone)">
                                        We couldn&apos;t load the users
                                    </p>
                                    <p className="mt-2 text-sm text-(--bone-dim)">
                                        Please try again later.
                                    </p>
                                </StateRow>
                            ) }

                            { isEmpty && (
                                <StateRow cellClassName="px-4 py-16 sm:px-6">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-(--bone)">
                                        No users found
                                    </p>
                                </StateRow>
                            ) }

                            { isNoMatch && (
                                <StateRow cellClassName="px-4 py-16 sm:px-6">
                                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-(--bone)">
                                        No matching users
                                    </p>
                                </StateRow>
                            ) }

                            { status === "success" &&
                                filteredUsers.map((user, index) => (
                                    <tr
                                        key={ user.id ?? user.email ?? `${user.name}-${index}` }
                                        className="border-b border-(--line-soft) last:border-b-0"
                                    >
                                        <td className="p-0">
                                            <button
                                                type="button"
                                                onClick={ () => setSelectedUser(user) }
                                                aria-label={ `View details for ${user.name || "user"}` }
                                                className="block w-full cursor-pointer px-4 py-4 text-left outline-none transition-colors hover:bg-(--row-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--electric) sm:px-6"
                                            >
                                                <span className="flex min-w-0 items-start gap-3">
                                                    <span
                                                        aria-hidden="true"
                                                        className={ `grid size-10 shrink-0 place-items-center border border-(--line-strong) font-mono text-xs font-semibold text-(--ink) ${index % 2 === 0
                                                            ? "bg-(--electric)"
                                                            : "bg-(--bone-dim)"
                                                            }` }
                                                    >
                                                        { getInitials(user.name) }
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block min-w-0 truncate font-semibold text-(--bone)">
                                                            { user.name || "Unnamed user" }
                                                        </span>
                                                        <span className="mt-1 block max-w-full truncate font-mono text-[12px] text-(--bone-dim)">
                                                            { user.email || "No email available" }
                                                        </span>
                                                    </span>

                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                )) }
                        </tbody>
                    </table>
                </div>
            </div>

            <UserDetailModal user={ selectedUser } onClose={ closeModal } />
        </>
    );
}
