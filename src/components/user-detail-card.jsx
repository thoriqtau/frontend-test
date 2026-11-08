const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
};

function DetailField({ label, value }) {
    return (
        <div className="min-w-0 py-2 first:pt-0 last:pb-0">
            <dt className="mb-1 text-[10px] font-semibold uppercase tracking-[0.65px] text-(--bone-dim)">
                { label }
            </dt>
            <dd className="break-words text-[12px] leading-[1.6] text-(--bone) [overflow-wrap:anywhere]">
                { formatValue(value) }
            </dd>
        </div>
    );
}

function DetailSection({ title, items }) {
    return (
        <section className="min-w-0 bg-(--ink-3) p-3">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.65px] text-(--bone)">
                { title }
            </h3>

            <dl>
                { items.map((item) => (
                    <DetailField key={ item.label } { ...item } />
                )) }
            </dl>
        </section>
    );
}

export default function UserDetailCard({ user }) {
    const address = user.address || {};
    const geo = address.geo || {};
    const company = user.company || {};

    const profileItems = [
        { label: "ID", value: user.id },
        { label: "Name", value: user.name },
        { label: "Username", value: user.username },
    ];

    const contactItems = [
        { label: "Email", value: user.email },
        { label: "Phone", value: user.phone },
        { label: "Website", value: user.website },
    ];

    const addressItems = [
        { label: "Street", value: address.street },
        { label: "Suite", value: address.suite },
        { label: "City", value: address.city },
        { label: "Zipcode", value: address.zipcode },
        { label: "Latitude", value: geo.lat },
        { label: "Longitude", value: geo.lng },
    ];

    const companyItems = [
        { label: "Name", value: company.name },
        { label: "Catch phrase", value: company.catchPhrase },
        { label: "Business strategy", value: company.bs },
    ];

    return (
        <article className="min-w-0 bg-(--ink-2) p-3 text-left sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <DetailSection title="Profile" items={ profileItems } />
                <DetailSection title="Contact" items={ contactItems } />
                <DetailSection title="Address" items={ addressItems } />
                <DetailSection title="Company" items={ companyItems } />
            </div>
        </article>
    );
}
