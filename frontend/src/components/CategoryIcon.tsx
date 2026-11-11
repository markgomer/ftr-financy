import { COLOR_STYLES, getCategoryIcon } from "../lib/categories";

type Props = { icon: string; color: string };

export function CategoryIcon({ icon, color }: Props) {
    const Icon = getCategoryIcon(icon);
    const style = COLOR_STYLES[color] ?? COLOR_STYLES.blue;

    return (
        <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${style.box}`}
        >
            <Icon size={16} />
        </div>
    );
}
